import { LoggerConfig } from '../../../config/logger';
import { ValidateNestedProperty } from '@aiokit/validation';

export class LoggerRootConfig {
  @ValidateNestedProperty({ classType: LoggerConfig })
  logger!: LoggerConfig;
}
