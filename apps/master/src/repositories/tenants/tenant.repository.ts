import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Tenant } from '../../database/entities';
import {
    BaseTypeormTenantedEntityRepository as BaseRepository
} from '@aiokit/orm';


import { ClsService } from 'nestjs-cls';
import { TenantClsStore } from '@aiokit/persistence-api';



@Injectable()
export class TenantRepository extends BaseRepository<Tenant, 'id'> {
  constructor(
  @InjectDataSource()
  ds: DataSource,
  clsService: ClsService<TenantClsStore>,
  ) {
    super(Tenant, ds, 'id', clsService);
  }
}


