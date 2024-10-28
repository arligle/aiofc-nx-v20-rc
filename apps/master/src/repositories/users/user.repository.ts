import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../../database/entities';
import {

    BaseTypeormTenantedEntityRepository as BaseRepository

} from '@aiokit/orm';


import { ClsService } from 'nestjs-cls';
import { TenantClsStore } from '@aiokit/persistence-api';



@Injectable()
export class UserRepository extends BaseRepository<User, 'id'> {
  constructor(
  @InjectDataSource()
  ds: DataSource,
  clsService: ClsService<TenantClsStore>,
  ) {
    super(User, ds, 'id', clsService);
  }
}


