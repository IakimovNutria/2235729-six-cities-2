import { Expose } from 'class-transformer';
import { UserType } from '../../../types/user.type.js';

export class AuthorizedUserRdo {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarSourcePath!: string;

  @Expose()
  public name!: string;

  @Expose()
  public userType!: UserType;
}
