import { Module, Logger } from '@nestjs/common';
import * as path from 'node:path';
import * as Controllers from './controllers';

import * as Entities from './database/entities';
import * as Repositories from './repositories';

import * as Services from './services';

import { TypeOrmModule } from '@nestjs/typeorm';
import { setupTypeormModule } from '@aiokit/orm';

import MasterRootConfig from './config/master-root.config';

import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  AccessGuard,
  JwtAuthGuard,
  JwtStrategy,
  TokenService,
} from '@aiokit/auth';


import { setupI18NModule } from '@aiokit/i18n';


import { setupLoggerModule } from '@aiokit/logger';
import { setupYamlBaseConfigModule } from '@aiokit/config';
import { setupClsModule } from '@aiokit/async-storage';

import { HealthCheckModule } from '@aiokit/health-check';


@Module({
  imports: [

    JwtModule,


    setupI18NModule(__dirname),

    setupLoggerModule(),
    setupYamlBaseConfigModule(__dirname, MasterRootConfig),
    setupClsModule(),

    HealthCheckModule,


    TypeOrmModule.forFeature(Object.values(Entities)),
    setupTypeormModule(),

  ],
  controllers: Object.values(Controllers),
  providers: [
    ...Object.values(Services),
    ...Object.values(Repositories),
    Logger,

    JwtStrategy,
    JwtService,
    TokenService,
     {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
     },
     {
      provide: APP_GUARD,
      useClass: AccessGuard,
     },

  ],
})
export class MasterAppModule {}
