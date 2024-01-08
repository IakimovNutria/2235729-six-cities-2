import { Container } from 'inversify';
import { AuthType } from './auth.type.js';
import { Component } from '../../types/component.type.js';
import { ExceptionFilter } from '../http/exception-filter.type.js';
import { AuthService } from './auth.service.js';
import { AuthExceptionFilter } from './auth-exceptions-filter.js';

export function createAuthContainer() {
  const container = new Container();
  container.bind<AuthType>(Component.AuthService).to(AuthService).inSingletonScope();
  container.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return container;
}
