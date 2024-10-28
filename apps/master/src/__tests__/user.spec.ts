import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import {
  UserDTO,
  UpdateUserRequest,
} from '../controllers/users/vo/user.dto';
import {
  UserService,
} from '../services';
import { bootstrapBaseWebApp } from '@aiokit/bootstrap';
import { StartedDb, startPostgres } from '@aiokit/test-utils';
import { Paginated } from 'nestjs-paginate';
import { createUser } from './generators/user';
import { registerTenant } from './generators/user';
import { AuthConfig } from '@aiokit/auth';

function verifyEntity(
  responseBody: UserDTO,
  expected: Partial<UserDTO>,
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


describe('user e2e test', () => {
  let app: NestFastifyApplication;
  let service: UserService;
  let authConfig: AuthConfig;
  let defaultHeaders: Record<string, string>;
  let db: StartedDb;
  const baseControllerUrl = `apps/v1/user`;

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

    service = app.get(UserService);
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

  it('find all user, GET ', async () => {
    const entitiesToCreate = 10;

    const allCreated = await Promise.all(
      [...Array.from({ length: entitiesToCreate }).keys()].map(() => {
        return app.inject({
          method: 'POST',
          url: baseControllerUrl,
          payload: createUser(),
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

    const responseBody: Paginated<UserDTO> = response.json();

    expect(responseBody.data.length).toEqual(entitiesToCreate);
    expect(allCreated.length).toEqual(entitiesToCreate);
  });

  it(`should create one, POST: ${baseControllerUrl}`, async () => {
    const user = createUser();

    const response = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: user,
      headers: defaultHeaders,
    });
    const responseBody = response.json<UserDTO>();

    expect(response.statusCode).toEqual(201);
    verifyEntity(responseBody, user);
  });

  it(`should find one by id, GET: ${baseControllerUrl}/:id`, async () => {
    const user = createUser();

    const createResponse = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: user,
      headers: defaultHeaders,
    });
    const createResponseBody = createResponse.json<UserDTO>();

    expect(createResponse.statusCode).toEqual(201);
    verifyEntity(createResponseBody, user);

    const findResponse = await app.inject({
      method: 'GET',
      url: `${baseControllerUrl}/${createResponseBody.id}`,
      headers: defaultHeaders,
    });

    expect(findResponse.statusCode).toEqual(200);

    const findResponseBody = findResponse.json<UserDTO>();

    expect(findResponseBody).toStrictEqual(createResponseBody);
  });

  it(`should update one, PUT: ${baseControllerUrl}/:id`, async () => {
    const user = createUser();

    const createResponse = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: user,
      headers: defaultHeaders,
    });
    const createResponseBody = createResponse.json<UserDTO>();

    expect(createResponse.statusCode).toEqual(201);
    verifyEntity(createResponseBody, user);

    const dataToUpdate: UpdateUserRequest = {
      ...createUser(),
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

    const updateResponseBody = updateResponse.json<UserDTO>();

    verifyEntity(updateResponseBody, dataToUpdate, ['version']);
  });

  it(`should archive one, DELETE: ${baseControllerUrl}/:id`, async () => {
    const user = createUser();

    const createResponse = await app.inject({
      method: 'POST',
      url: baseControllerUrl,
      payload: user,
      headers: defaultHeaders,
    });
    const createResponseBody = createResponse.json<UserDTO>();

    expect(createResponse.statusCode).toEqual(201);
    verifyEntity(createResponseBody, user);

    const findResponse = await app.inject({
      method: 'GET',
      url: `${baseControllerUrl}/${createResponseBody.id}`,
      headers: defaultHeaders,
    });

    expect(findResponse.statusCode).toEqual(200);

    const findResponseBody = findResponse.json<UserDTO>();

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
