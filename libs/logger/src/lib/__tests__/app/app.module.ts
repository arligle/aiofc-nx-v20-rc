import { Module } from '@nestjs/common';
import { setupLoggerModule } from '../../module';
import { setupYamlBaseConfigModule } from '@aiokit/config';
import { LoggerRootConfig } from './config/logger-root.config';

@Module({
  controllers: [],
  exports: [],
  imports: [
    setupYamlBaseConfigModule(__dirname, LoggerRootConfig),
    setupLoggerModule(),
  ],
})
export class AppModule {}
