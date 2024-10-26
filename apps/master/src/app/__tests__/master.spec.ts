import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { startPostgres, StartedDb } from '@aiokit/test-utils';

import { bootstrapBaseWebApp } from '@aiokit/bootstrap';

describe('Test MasterAppModule tests', () => {
  let app: NestFastifyApplication;

  let db: StartedDb;


  beforeAll(async () => {

    db = await startPostgres({
      runMigrations: true,
    });

  });

  afterAll(async () => {
    await db.container.stop();
  });

  beforeEach(async () => {
    const { MasterAppModule } = require('../master-app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MasterAppModule],
    }).compile();
    app = await bootstrapBaseWebApp(moduleFixture, MasterAppModule);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('Test Master app start up', () => {
    it('app bootstrap', async () => {
      expect(app).toBeDefined();
    });
  });
});
