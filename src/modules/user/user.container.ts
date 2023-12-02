import { Container } from 'inversify';
import { UserServiceInterface } from './user-service.interface.js';
import UserService from './user.service.js';
import { Component } from '../../types/component.type.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(Component.UserService).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

  return userContainer;
}
