import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { JWT_ALGORITHM, JWT_EXPIRED } from '../../constants/auth.js';
import { Component } from '../../types/component.type.js';
import { LoggerType } from '../logger/logger.type.js';
import { AuthType } from './auth.type';
import { ConfigSchema, ConfigType } from '../../config/config.type.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import { UserEntity } from '../../modules/user/user.entity.js';
import { TokenPayload } from '../../types/token-payload.type.js';
import { LoginUserDto } from '../../modules/user/dto/login-user.dto.js';
import { HttpError } from '../http/http-error.type.js';

@injectable()
export class AuthService implements AuthType {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerType,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.Config) private readonly config: ConfigType<ConfigSchema>,
  ) { }

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      firstname: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new HttpError(StatusCodes.NOT_FOUND, `User with ${dto.email} not found`);
    }

    if (!user.checkPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Incorrect username or password');
    }

    return user;
  }
}
