import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { getDataSourceByName } from 'typeorm-transactional/dist/common';
import { addTransactionalDataSource } from 'typeorm-transactional';
import {
  DEFAULT_SETUP_TYPEORM_OPTIONS,
  SetupTypeormOptions,
} from './vo/setup-typeorm-options';
/**
 * @description 主要作用是简化 TypeORM 模块的配置和初始化过程，
 * 确保在应用启动时正确配置和管理数据库连接。
 * @export
 * @param [options]
 * @return {*}
 */
export function setupTypeormModule(options?: SetupTypeormOptions) {
  const optionsWithDefault = {
    ...DEFAULT_SETUP_TYPEORM_OPTIONS,
    ...options,
  };

  return TypeOrmModule.forRootAsync({
    useClass: optionsWithDefault.optionsFactory, // TypeOrmConfigService
    dataSourceFactory: async (baseOptions?: DataSourceOptions) => {
      /* istanbul ignore next */
      if (!baseOptions) {
        // this will be a startup error we don't need to cover it with tests
        throw new Error(`Can not initialize data source, options are empty`);
      }

      // it's needed only for e2e tests
      const existDatasource = getDataSourceByName('default');

      if (existDatasource) {
        return existDatasource;
      }

      const options = {
        ...baseOptions,
        migrations: optionsWithDefault.migrations,
      };

      const dataSource = new DataSource(options);
      addTransactionalDataSource(dataSource);

      return await dataSource.initialize();
    },
  });
}
