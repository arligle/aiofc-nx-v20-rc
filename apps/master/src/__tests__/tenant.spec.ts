import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import {
  TenantDTO,
  UpdateTenantRequest,
} from '../controllers/tenants/vo/tenant.dto';
import {
  TenantService,
} from '../services';
import { bootstrapBaseWebApp } from '@aiokit/bootstrap';
import { StartedDb, startPostgres } from '@aiokit/test-utils';
import { Paginated } from 'nestjs-paginate';
import { createTenant } from './generators/tenant';
import { registerTenant } from './generators/user';
import { AuthConfig } from '@aiokit/auth';

function verifyEntity(
  responseBody: TenantDTO,
  expected: Partial<TenantDTO>,
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


describe('tenant e2e test', () => {
  let app: NestFastifyApplication;
  let service: TenantService;
  let authConfig: AuthConfig;
  let defaultHeaders: Record<string, string>;
  let db: StartedDb;
  const baseControllerUrl = `apps/v1/tenant`;

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

    service = app.get(TenantService);
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

  it('find all tenant, GET ', async () => {
    const entitiesToCreate = 10;

    const allCreated = await Promise.all(
      [...Array.from({ length: entitiesToCreate }).keys()].map(() => {
        return app.inject({
          method: 'POST',
          url: baseControllerUrl,
          payload: createTenant(),
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

    const responseBody: Paginated<TenantDTO> = response.json();

    expect(responseBody.data.length).toEqual(entitiesToCreate);
    expect(allCreated.length).toEqual(entitiesToCreate);
  });

  it(`should create one, POST: ${baseControllerUrl}`, async () => {
    const tenant = createTenant();

    const response = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: tenant,
      headers: defaultHeaders,
    });
    const responseBody = response.json<TenantDTO>();

    expect(response.statusCode).toEqual(201);
    verifyEntity(responseBody, tenant);
  });

  it(`should find one by id, GET: ${baseControllerUrl}/:id`, async () => {
    const tenant = createTenant();

    const createResponse = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: tenant,
      headers: defaultHeaders,
    });
    const createResponseBody = createResponse.json<TenantDTO>();

    expect(createResponse.statusCode).toEqual(201);
    verifyEntity(createResponseBody, tenant);

    const findResponse = await app.inject({
      method: 'GET',
      url: `${baseControllerUrl}/${createResponseBody.id}`,
      headers: defaultHeaders,
    });

    expect(findResponse.statusCode).toEqual(200);

    const findResponseBody = findResponse.json<TenantDTO>();

    expect(findResponseBody).toStrictEqual(createResponseBody);
  });

  it(`should update one, PUT: ${baseControllerUrl}/:id`, async () => {
    const tenant = createTenant();

    const createResponse = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: tenant,
      headers: defaultHeaders,
    });
    const createResponseBody = createResponse.json<TenantDTO>();

    expect(createResponse.statusCode).toEqual(201);
    verifyEntity(createResponseBody, tenant);

    const dataToUpdate: UpdateTenantRequest = {
      ...createTenant(),
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

    const updateResponseBody = updateResponse.json<TenantDTO>();

    verifyEntity(updateResponseBody, dataToUpdate, ['version']);
  });

  it(`should archive one, DELETE: ${baseControllerUrl}/:id`, async () => {
    const tenant = createTenant();

    const createResponse = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: tenant,
      headers: defaultHeaders,
    });
    const createResponseBody = createResponse.json<TenantDTO>();

    expect(createResponse.statusCode).toEqual(201);
    verifyEntity(createResponseBody, tenant);

    const findResponse = await app.inject({
      method: 'GET',
      url: `${baseControllerUrl}/${createResponseBody.id}`,
      headers: defaultHeaders,
    });

    expect(findResponse.statusCode).toEqual(200);

    const findResponseBody = findResponse.json<TenantDTO>();

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
