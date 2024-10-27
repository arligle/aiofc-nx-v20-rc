import { LoggerConfig } from '@aiokit/logger';
import { AuthConfig } from '@aiokit/auth';
import { SwaggerConfig } from '@aiokit/swagger-utils';
import { I18Config } from '@aiokit/i18n';
import { DbConfig } from '@aiokit/orm';
import { AppConfig } from '@aiokit/bootstrap';
// import { HttpClientConfig } from '@aiokit/server-http-client';
// import { PlatformClientConfig } from '@aiokit/platform-client';
import { HealthConfig } from '@aiokit/health-check';
import { ValidateNestedProperty } from '@aiokit/validation';

export default class MasterRootConfig {
  @ValidateNestedProperty({ classType: LoggerConfig })
  public readonly logs!: LoggerConfig;

  @ValidateNestedProperty({ classType: AuthConfig })
  public readonly auth!: AuthConfig;

  @ValidateNestedProperty({ classType: AppConfig })
  public readonly app!: AppConfig;

  @ValidateNestedProperty({ classType: SwaggerConfig })
  public readonly swagger!: SwaggerConfig;

  @ValidateNestedProperty({ classType: I18Config })
  public readonly i18!: I18Config;


  @ValidateNestedProperty({ classType: DbConfig })
  public readonly db!: DbConfig;



  @ValidateNestedProperty({ classType: HealthConfig })
  public readonly health!: HealthConfig;


}
