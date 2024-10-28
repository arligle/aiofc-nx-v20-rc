import { Injectable } from '@nestjs/common';
import { Role } from '../../database/entities';
import { RoleRepository } from '../../repositories';
import {

    BaseTrackedEntityService as BaseService

} from '@aiokit/service-api';


@Injectable()
export class RoleService extends BaseService<
 Role,
 'id',
 RoleRepository,
 Pick<Role, 'id' | 'version'>
> {
  constructor(
    repository: RoleRepository
  ) {
    super(repository);
  }
}


