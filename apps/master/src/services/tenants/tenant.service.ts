import { Injectable } from '@nestjs/common';
import { Tenant } from '../../database/entities';
import { TenantRepository } from '../../repositories';
import {

    BaseTenantEntityService as BaseService

} from '@aiokit/service-api';


@Injectable()
export class TenantService extends BaseService<
 Tenant,
 'id',
 TenantRepository,
 Pick<Tenant, 'id' | 'version'>
> {
  constructor(
    repository: TenantRepository
  ) {
    super(repository);
  }
}


