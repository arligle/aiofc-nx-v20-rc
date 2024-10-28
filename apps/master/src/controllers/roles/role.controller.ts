import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IdParamUUID, VersionNumberParam } from '@aiokit/common-types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@aiokit/auth';
import {
  RoleService,
} from '../../services';

import {
  RoleDTO,
  CreateRoleRequest,
  UpdateRoleRequest,
  ROLE_PAGINATION_CONFIG
} from './vo/role.dto';

import {
  Paginate,
  Paginated,
  PaginatedSwaggerDocs,
  PaginateQuery,
} from 'nestjs-paginate';
import { map } from '@aiokit/validation';

@ApiTags('Role')
@Controller({
  path: 'role',
  version: '1',
})
@ApiBearerAuth()
export class RoleController {
  constructor(
    private readonly service: RoleService,
  ) {}

  @Get()
  @PaginatedSwaggerDocs(
    RoleDTO,
    ROLE_PAGINATION_CONFIG,
  )
  @Permissions('master.role.read')
  async findAll(
    @Paginate()
    query: PaginateQuery,
  ): Promise<Paginated<RoleDTO>> {
    return this.service.findAllPaginatedAndTransform(
      query,
      ROLE_PAGINATION_CONFIG,
      RoleDTO,
    );
  }

  @Get(':id')
  @Permissions('master.role.read')
  async findOne(
    @Param() param: IdParamUUID,
  ): Promise<RoleDTO> {
    return this.service.findOneById(param.id).then((data) => {
      return map(data, RoleDTO);
    });
  }

  @Post()
  @Permissions('master.role.create')
  async create(@Body() dto: CreateRoleRequest): Promise<RoleDTO> {
    return this.service
      .createOrUpdateEntity(dto)
      .then((item) => {
        return map(item, RoleDTO);
      });
  }

  @Put(':id')
  @Permissions('master.role.update')
  async updateOne(
    @Param() param: IdParamUUID,

    @Query() query: VersionNumberParam,

    @Body() dto: UpdateRoleRequest
    ): Promise<RoleDTO> {
    return this.service
      .createOrUpdateEntity({
        id: param.id,

        version: query.version,

        ...dto,
      })
      .then((item) => {
        return this.service.findOneById(item.id);
      })
      .then((item) => {
        return map(item, RoleDTO);
      });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('master.role.delete')
  async softDelete(@Param() param: IdParamUUID, @Query() query: VersionNumberParam) {
    return this.service.archive(param.id, query.version);
  }
}
