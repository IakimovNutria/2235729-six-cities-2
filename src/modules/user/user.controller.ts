import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../../types/component.type.js';
import { Controller } from '../../core/controller/controller.js';
import { LoggerType } from '../../core/logger/logger.type.js';
import { HttpMethod } from '../../types/http-method.type.js';
import { fillDTO } from '../../core/helpers/common.js';
import { UserServiceInterface } from './user-service.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import { HttpError } from '../../core/http/http-error.type.js';
import { ConfigType } from '../../config/config.type.js';
import { ConfigSchema } from '../../config/config.type.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { FullOfferRdo } from '../offer/rdo/full-offer.rdo.js';


@injectable()
export default class UserController extends Controller {
  constructor(@inject(Component.Logger) logger: LoggerType,
              @inject(Component.OfferService) private readonly userService: UserServiceInterface,
              @inject(Component.Config) private readonly configService: ConfigType<ConfigSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for CategoryController…');

    this.addRoute({ path: '/register', method: HttpMethod.Get, handler: this.register });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Post, handler: this.addFavorite });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Delete, handler: this.deleteFavorite });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.getFavorite });
  }

  public async register(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async getFavorite({ body }: Request<Record<string, unknown>, Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = await this.userService.findFavorites(body.userId);
    this.ok(_res, fillDTO(FullOfferRdo, result));
  }

  public async addFavorite({ body }: Request<Record<string, unknown>, Record<string, unknown>, {offerId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Предложение добавлено в избранное' });
  }

  public async deleteFavorite({ body }: Request<Record<string, unknown>, Record<string, unknown>, {offerId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Предложение удалено из избранного' });
  }
}
