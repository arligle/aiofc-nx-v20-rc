import {
  Entity,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';
import { IsNumberLocalized } from '@aiokit/validation';
import { Expose } from 'class-transformer';

import {

    BaseTenantEntityHelper as BaseEntity

} from '@aiokit/orm';

@Entity('tenant')
export class Tenant extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id!: string;



  @VersionColumn()
  @IsNumberLocalized()
  @Expose()
  version!: number;

}
