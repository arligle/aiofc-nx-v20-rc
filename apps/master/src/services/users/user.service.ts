import { Injectable } from '@nestjs/common';
import { User } from '../../database/entities';
import { UserRepository } from '../../repositories';
import {

    BaseTenantEntityService as BaseService

} from '@aiokit/service-api';


@Injectable()
export class UserService extends BaseService<
 User,
 'id',
 UserRepository,
 Pick<User, 'id' | 'version'>
> {
  constructor(
    repository: UserRepository
  ) {
    super(repository);
  }
}


