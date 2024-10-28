import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Role } from '../../database/entities';
import {

    BaseTypeormTenantedEntityRepository as BaseRepository

} from '@aiokit/orm';


import { ClsService } from 'nestjs-cls';
import { TenantClsStore } from '@aiokit/persistence-api';



@Injectable()
export class RoleRepository extends BaseRepository<Role, 'id'> {
  constructor(
  @InjectDataSource()
  ds: DataSource,
  clsService: ClsService<TenantClsStore>,
  ) {
    super(Role, ds, 'id', clsService);
  }
}


