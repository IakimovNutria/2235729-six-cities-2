import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './types/component.type.js';
import Application from './app/application.js';
import { createUserContainer } from './modules/user/user.container.js';
import { createApplicationContainer } from './app/api.container.js';
import { createOfferContainer } from './modules/offer/offer.contatiner.js';
import { createCommentContainer } from './modules/comment/comment.container.js';
import { createAuthContainer } from './core/auth/auth.container.js';

const mainContainer = Container.merge(
  createApplicationContainer(),
  createUserContainer(),
  createOfferContainer(),
  createCommentContainer(),
  createAuthContainer(),
);
const application = mainContainer.get<Application>(Component.Application);

await application.init();
