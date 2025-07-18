#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './apps/rest/index.js';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Components } from './shared/types/index.js';
import { RestSchema, Config, RestConfig } from './shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';
import { UserEntity, UserModel, UserService, DefaultUserService } from './shared/modules/user/index.js';
import { types } from '@typegoose/typegoose';
import { CityEntity, CityModel, CityService, DefaultCityService } from './shared/modules/city/index.js';

function bootstrap() {
  const container = new Container();
  container.bind<Logger>(Components.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Components.RestConfig).to(RestConfig).inSingletonScope();
  container.bind<RestApplication>(Components.RestApplication).to(RestApplication);
  container.bind<DatabaseClient>(Components.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<UserService>(Components.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(Components.UserModel).toConstantValue(UserModel);
  container.bind<CityService>(Components.CityService).to(DefaultCityService).inSingletonScope();
  container.bind<types.ModelType<CityEntity>>(Components.CityModel).toConstantValue(CityModel);

  const restApp = container.get<RestApplication>(Components.RestApplication);
  restApp.init();
}

bootstrap();
