import { UserEntity } from '../../modules/user/user.entity';
import { LoginUserDto } from '../../modules/user/dto/login-user.dto';

export type AuthType = {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}
