import { SwaggerConfig } from './test-swagger.config';
import { ValidateNestedProperty } from '@aiokit/validation';

export class RootConfig {
  @ValidateNestedProperty({ classType: SwaggerConfig })
  public readonly swagger!: SwaggerConfig;
}
