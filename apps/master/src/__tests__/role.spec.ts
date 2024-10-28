import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import {
  RoleDTO,
  UpdateRoleRequest,
} from '../controllers/roles/vo/role.dto';
import {
  RoleService,
} from '../services';
import { bootstrapBaseWebApp } from '@aiokit/bootstrap';
import { StartedDb, startPostgres } from '@aiokit/test-utils';
import { Paginated } from 'nestjs-paginate';
import { createRole } from './generators/role';
import { registerTenant } from './generators/user';
import { AuthConfig } from '@aiokit/auth';

function verifyEntity(
  responseBody: RoleDTO,
  expected: Partial<RoleDTO>,
  excludedFields: string[] = [],
) {
  const keys = Object.keys(expected).filter((k) => !excludedFields.includes(k));

  for (const key of keys) {
    expect(expected[key]).toEqual(responseBody[key]);
  }

  expect(responseBody.createdAt).not.toBeNil();
  expect(responseBody.updatedAt).not.toBeNil();
  expect(responseBody.id).not.toBeNil();
  expect(responseBody.version).toBeGreaterThanOrEqual(1);
  expect(responseBody.tenantId).not.toBeNil();
}


describe('role e2e test', () => {
  let app: NestFastifyApplication;
  let service: RoleService;
  let authConfig: AuthConfig;
  let defaultHeaders: Record<string, string>;
  let db: StartedDb;
  const baseControllerUrl = `apps/v1/role`;

  beforeAll(async () => {
    db = await startPostgres({
      runMigrations: true,
    });
  }, 60_000);

  afterAll(async () => {
    await db.container.stop();
  });

  beforeEach(async () => {
    const { MasterAppModule } = require('../master-app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MasterAppModule],
    })
      .compile();

    app = await bootstrapBaseWebApp(moduleFixture, MasterAppModule);

    service = app.get(RoleService);
    authConfig = app.get(AuthConfig);

    const { tenant, adminAccessToken } = await registerTenant(app);

    defaultHeaders = {
      Authorization: `Bearer ${adminAccessToken}`,
      [authConfig.headerTenantId]: tenant.id,
    };
  });

  afterEach(async () => {
    await app.flushLogs();
    await app.close();
  });

  it('find all role, GET ', async () => {
    const entitiesToCreate = 10;

    const allCreated = await Promise.all(
      [...Array.from({ length: entitiesToCreate }).keys()].map(() => {
        return app.inject({
          method: 'POST',
          url: baseControllerUrl,
          payload: createRole(),
          headers: defaultHeaders,
        });
      }),
    );

    const response = await app.inject({
      method: 'GET',
      url: baseControllerUrl,
      headers: defaultHeaders,
    });

    expect(response.statusCode).toEqual(200);

    const responseBody: Paginated<RoleDTO> = response.json();

    expect(responseBody.data.length).toEqual(entitiesToCreate);
    expect(allCreated.length).toEqual(entitiesToCreate);
  });

  it(`should create one, POST: ${baseControllerUrl}`, async () => {
    const role = createRole();

    const response = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: role,
      headers: defaultHeaders,
    });
    const responseBody = response.json<RoleDTO>();

    expect(response.statusCode).toEqual(201);
    verifyEntity(responseBody, role);
  });

  it(`should find one by id, GET: ${baseControllerUrl}/:id`, async () => {
    const role = createRole();

    const createResponse = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: role,
      headers: defaultHeaders,
    });
    const createResponseBody = createResponse.json<RoleDTO>();

    expect(createResponse.statusCode).toEqual(201);
    verifyEntity(createResponseBody, role);

    const findResponse = await app.inject({
      method: 'GET',
      url: `${baseControllerUrl}/${createResponseBody.id}`,
      headers: defaultHeaders,
    });

    expect(findResponse.statusCode).toEqual(200);

    const findResponseBody = findResponse.json<RoleDTO>();

    expect(findResponseBody).toStrictEqual(createResponseBody);
  });

  it(`should update one, PUT: ${baseControllerUrl}/:id`, async () => {
    const role = createRole();

    const createResponse = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: role,
      headers: defaultHeaders,
    });
    const createResponseBody = createResponse.json<RoleDTO>();

    expect(createResponse.statusCode).toEqual(201);
    verifyEntity(createResponseBody, role);

    const dataToUpdate: UpdateRoleRequest = {
      ...createRole(),
      version: createResponseBody.version,
    };

    const updateResponse = await app.inject({
      method: 'PUT',
      url: `${baseControllerUrl}/${createResponseBody.id}?version=${createResponseBody.version}`,
      payload: {
        ...dataToUpdate,
      },
      headers: defaultHeaders,
    });

    expect(updateResponse.statusCode).toEqual(200);

    const updateResponseBody = updateResponse.json<RoleDTO>();

    verifyEntity(updateResponseBody, dataToUpdate, ['version']);
  });

  it(`should archive one, DELETE: ${baseControllerUrl}/:id`, async () => {
    const role = createRole();

    const createResponse = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: role,
      headers: defaultHeaders,
    });
    const createResponseBody = createResponse.json<RoleDTO>();

    expect(createResponse.statusCode).toEqual(201);
    verifyEntity(createResponseBody, role);

    const findResponse = await app.inject({
      method: 'GET',
      url: `${baseControllerUrl}/${createResponseBody.id}`,
      headers: defaultHeaders,
    });

    expect(findResponse.statusCode).toEqual(200);

    const findResponseBody = findResponse.json<RoleDTO>();

    expect(findResponseBody).toStrictEqual(createResponseBody);

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `${baseControllerUrl}/${createResponseBody.id}?version=${createResponseBody.version}`,
      headers: defaultHeaders,
    });

    expect(deleteResponse.statusCode).toEqual(204);

    const findResponseAfterDelete = await app.inject({
      method: 'GET',
      url: `${baseControllerUrl}/${createResponseBody.id}`,
      headers: defaultHeaders,
    });

    expect(findResponseAfterDelete.statusCode).toEqual(404);
  });


});
