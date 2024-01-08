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
import { UploadFileMiddleware } from '../../core/middleware/upload-file.middleware.js';
import { ValidateObjectIdMiddleware } from '../../core/middleware/validate-objectId.middleware.js';
import { ValidateDtoMiddleware } from '../../core/middleware/validate-dto.middleware.js';
import { AuthService } from '../../core/auth/auth.service.js';
import { PrivateRouteMiddleware } from '../../core/middleware/private-route.middleware.js';
import { AuthorizedUserRdo } from './rdo/authorized-user.rdo.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.Logger) logger: LoggerType,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.Config) private readonly configService: ConfigType<ConfigSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
      ],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto),
      ],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [
        new PrivateRouteMiddleware(),
      ],
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });
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
    res: Response
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const response = fillDTO(AuthorizedUserRdo, {
      email: user.email,
      token,
    });
    this.ok(res, response);
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      avatarSourcePath: req.file?.path
    });
  }

  public async checkAuthenticate({ tokenPayload }: Request, res: Response) {
    const user = await this.userService.findByEmail(tokenPayload.email);
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    this.ok(res, fillDTO(AuthorizedUserRdo, user));
  }
}
