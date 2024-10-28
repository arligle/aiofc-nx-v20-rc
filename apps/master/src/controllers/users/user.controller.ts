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
  UserService,
} from '../../services';

import {
  UserDTO,
  CreateUserRequest,
  UpdateUserRequest,
  USER_PAGINATION_CONFIG
} from './vo/user.dto';

import {
  Paginate,
  Paginated,
  PaginatedSwaggerDocs,
  PaginateQuery,
} from 'nestjs-paginate';
import { map } from '@aiokit/validation';

@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly service: UserService,
  ) {}

  @Get()
  @PaginatedSwaggerDocs(
    UserDTO,
    USER_PAGINATION_CONFIG,
  )
  @Permissions('master.user.read')
  async findAll(
    @Paginate()
    query: PaginateQuery,
  ): Promise<Paginated<UserDTO>> {
    return this.service.findAllPaginatedAndTransform(
      query,
      USER_PAGINATION_CONFIG,
      UserDTO,
    );
  }

  @Get(':id')
  @Permissions('master.user.read')
  async findOne(
    @Param() param: IdParamUUID,
  ): Promise<UserDTO> {
    return this.service.findOneById(param.id).then((data) => {
      return map(data, UserDTO);
    });
  }

  @Post()
  @Permissions('master.user.create')
  async create(@Body() dto: CreateUserRequest): Promise<UserDTO> {
    return this.service
      .createOrUpdateEntity(dto)
      .then((item) => {
        return map(item, UserDTO);
      });
  }

  @Put(':id')
  @Permissions('master.user.update')
  async updateOne(
    @Param() param: IdParamUUID,

    @Query() query: VersionNumberParam,

    @Body() dto: UpdateUserRequest
    ): Promise<UserDTO> {
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
        return map(item, UserDTO);
      });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('master.user.delete')
  async softDelete(@Param() param: IdParamUUID, @Query() query: VersionNumberParam) {
    return this.service.archive(param.id, query.version);
  }
}
