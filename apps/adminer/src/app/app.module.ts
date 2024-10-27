import { Module } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { setupI18NModule } from '@aiokit/i18n';
import { setupLoggerModule } from '@aiokit/logger';
import { setupYamlBaseConfigModule } from '@aiokit/config';
import MasterRootConfig from '../config/master-root.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { setupTypeormModule, TYPEORM_FACTORIES_TOKEN, TYPEORM_SEEDERS_TOKEN } from '@aiokit/orm';
import * as Entities from '../database/entities';
import * as Migrations from '../database/migrations';
import * as Seeders from '../database/seeds';
import * as Factories from '../database/factories';
@Module({
  imports: [
    setupI18NModule(__dirname),

    setupLoggerModule(),
    setupYamlBaseConfigModule(__dirname, MasterRootConfig),

     TypeOrmModule.forFeature(Object.values(Entities)),
     setupTypeormModule(
      {migrations: Migrations,}
    ),

  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: TYPEORM_SEEDERS_TOKEN,
      useValue: Object.values(Seeders),
    },
    {
      provide: TYPEORM_FACTORIES_TOKEN,
      useValue: Object.values(Factories),
    }
  ],
})
export class AppModule {}
