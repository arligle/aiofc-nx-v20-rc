import { Module } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { setupI18NModule } from '@aiokit/i18n';
import { setupLoggerModule } from '@aiokit/logger';
import { setupYamlBaseConfigModule } from '@aiokit/config';
import MasterRootConfig from '../config/master-root.config';

@Module({
  imports: [
    setupI18NModule(__dirname),

    setupLoggerModule(),
    setupYamlBaseConfigModule(__dirname, MasterRootConfig),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
