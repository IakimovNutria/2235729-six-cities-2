import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import { LoggerType } from '../logger/logger.type.js';
import { ExceptionFilter } from '../http/exception-filter.type.js';
import { HttpError } from '../http/http-error.type.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerType
  ) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message,
      });
  }
}
