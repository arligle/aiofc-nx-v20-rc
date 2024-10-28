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
  TenantService,
} from '../../services';

import {
  TenantDTO,
  CreateTenantRequest,
  UpdateTenantRequest,
  TENANT_PAGINATION_CONFIG
} from './vo/tenant.dto';

import {
  Paginate,
  Paginated,
  PaginatedSwaggerDocs,
  PaginateQuery,
} from 'nestjs-paginate';
import { map } from '@aiokit/validation';

@ApiTags('Tenant')
@Controller({
  path: 'tenant',
  version: '1',
})
@ApiBearerAuth()
export class TenantController {
  constructor(
    private readonly service: TenantService,
  ) {}

  @Get()
  @PaginatedSwaggerDocs(
    TenantDTO,
    TENANT_PAGINATION_CONFIG,
  )
  @Permissions('master.tenant.read')
  async findAll(
    @Paginate()
    query: PaginateQuery,
  ): Promise<Paginated<TenantDTO>> {
    return this.service.findAllPaginatedAndTransform(
      query,
      TENANT_PAGINATION_CONFIG,
      TenantDTO,
    );
  }

  @Get(':id')
  @Permissions('master.tenant.read')
  async findOne(
    @Param() param: IdParamUUID,
  ): Promise<TenantDTO> {
    return this.service.findOneById(param.id).then((data) => {
      return map(data, TenantDTO);
    });
  }

  @Post()
  @Permissions('master.tenant.create')
  async create(@Body() dto: CreateTenantRequest): Promise<TenantDTO> {
    return this.service
      .createOrUpdateEntity(dto)
      .then((item) => {
        return map(item, TenantDTO);
      });
  }

  @Put(':id')
  @Permissions('master.tenant.update')
  async updateOne(
    @Param() param: IdParamUUID,

    @Query() query: VersionNumberParam,

    @Body() dto: UpdateTenantRequest
    ): Promise<TenantDTO> {
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
        return map(item, TenantDTO);
      });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('master.tenant.delete')
  async softDelete(@Param() param: IdParamUUID, @Query() query: VersionNumberParam) {
    return this.service.archive(param.id, query.version);
  }
}
