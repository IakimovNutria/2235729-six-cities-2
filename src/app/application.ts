import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { LoggerType } from '../core/logger/logger.type.js';
import { Component } from '../types/component.type.js';
import { ConfigType, ConfigSchema } from '../config/config.type.js';
import { DatabaseClient } from '../core/database-client/database-client.type.js';
import { getConnectionString } from '../core/helpers/common.js';
import { ControllerType } from '../core/controller/controller.type.js';
import { ExceptionFilter } from '../core/http/exception-filter.type.js';
import { Controller } from '../core/controller/controller.js';
import { AuthExceptionFilter } from '../core/auth/auth-exceptions-filter.js';
import { ParseTokenMiddleware } from '../core/middleware/parse-token.middleware.js';

@injectable()
export default class Application {
  private expressApplication: Express;
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerType,
    @inject(Component.Config) private readonly settings: ConfigType<ConfigSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController) private readonly offerController: ControllerType,
    @inject(Component.UserController) private userController: ControllerType,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: AuthExceptionFilter,
  ) {
    this.expressApplication = express();
  }

  private async _initMiddleware() {
    this.logger.info('Мидлвары инициализируется');

    const authMiddleware = new ParseTokenMiddleware(this.settings.get('JWT_SECRET'));
    this.expressApplication.use(express.json());
    this.expressApplication.use(
      '/upload',
      express.static(this.settings.get('UPLOAD_DIRECTORY'))
    );
    this.expressApplication.use(authMiddleware.execute.bind(authMiddleware));

    this.logger.info('Мидлвары успешно инициализированы');
  }

  private async _initServer() {
    this.logger.info('Сервер инициализируется');

    const port = this.settings.get('PORT');
    this.expressApplication.listen(port);

    this.logger.info(`Сервер успешно стартовал на http://localhost:${this.settings.get('PORT')}`);
  }

  private async _initRoutes() {
    this.logger.info('Контроллеры инициализируются');
    this.expressApplication.use('/offers', this.offerController.router);
    this.expressApplication.use('/users', this.userController.router);
    this.expressApplication.use('/comments', this.commentController.router);
    this.logger.info('Контроллеры успешно инициализированы');
  }

  private async _initExceptionFilters() {
    this.expressApplication.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.expressApplication.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info(`PORT: ${this.settings.get('PORT')}`);
    this.logger.info('the application is initialized');

    this.logger.info('База данных инициализируется');
    const mongoUri = getConnectionString(
      this.settings.get('DB_USER'),
      this.settings.get('DB_PASSWORD'),
      this.settings.get('DB_HOST'),
      this.settings.get('DB_PORT'),
      this.settings.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);
    this.logger.info('База данных инициализирована');
    await this._initMiddleware();
    await this._initRoutes();
    await this._initExceptionFilters();
    await this._initServer();
  }
}
