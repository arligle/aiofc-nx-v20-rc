import { OmitType } from '@nestjs/swagger';
import { Tenant } from '../../../database/entities';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import {
  DEFAULT_CREATE_ENTITY_EXCLUDE_LIST,
  DEFAULT_ENTITY_EXCLUDE_LIST,
  DEFAULT_UPDATE_ENTITY_EXCLUDE_LIST,
} from '@aiokit/orm';

export class TenantDTO extends OmitType(Tenant, [
  ...DEFAULT_ENTITY_EXCLUDE_LIST,
] as const) {}

export class CreateTenantRequest extends OmitType(Tenant, [
  ...DEFAULT_CREATE_ENTITY_EXCLUDE_LIST,
'id',
'version',
'tenantId',
] as const) {}

export class UpdateTenantRequest extends OmitType(Tenant, [
  ...DEFAULT_UPDATE_ENTITY_EXCLUDE_LIST,
'tenantId',
'version',
] as const) {}

export const TENANT_PAGINATION_CONFIG: PaginateConfig<TenantDTO> = {
  defaultLimit: 50,
  maxLimit: 100,
  relations: [],
  searchableColumns: [],
  filterableColumns: {
    id: true,
    createdAt: [
      FilterOperator.GT,
      FilterOperator.GTE,
      FilterOperator.LT,
      FilterOperator.LTE,
    ],
  },
  select: [],
  sortableColumns: ['id', 'createdAt', 'updatedAt'],
  defaultSortBy: [
    ['createdAt', 'DESC'],
    ['id', 'DESC'],
  ],
};
