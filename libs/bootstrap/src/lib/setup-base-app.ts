import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export async function bootstrapBaseNestApp( module: any){
  const app = await NestFactory.create(module);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port =  3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}