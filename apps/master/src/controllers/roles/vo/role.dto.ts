import { OmitType } from '@nestjs/swagger';
import { Role } from '../../../database/entities';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import {
  DEFAULT_CREATE_ENTITY_EXCLUDE_LIST,
  DEFAULT_ENTITY_EXCLUDE_LIST,
  DEFAULT_UPDATE_ENTITY_EXCLUDE_LIST,
} from '@aiokit/orm';

export class RoleDTO extends OmitType(Role, [
  ...DEFAULT_ENTITY_EXCLUDE_LIST,
] as const) {}

export class CreateRoleRequest extends OmitType(Role, [
  ...DEFAULT_CREATE_ENTITY_EXCLUDE_LIST,
'id',
'version',
'tenantId',
] as const) {}

export class UpdateRoleRequest extends OmitType(Role, [
  ...DEFAULT_UPDATE_ENTITY_EXCLUDE_LIST,
'tenantId',
'version',
] as const) {}

export const ROLE_PAGINATION_CONFIG: PaginateConfig<RoleDTO> = {
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
