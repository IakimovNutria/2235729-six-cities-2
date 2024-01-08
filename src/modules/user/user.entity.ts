import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { UserType, User } from '../../types/user.type.js';
import { createSHA256 } from '../../core/helpers/common.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true, match: [/^.+@.+$/, 'Email is incorrect'] })
  public email: string;

  @prop({ required: false, default: '', match: [/.*\.(?:jpg|png)/, 'AvatarPath must be jpg or png'] })
  public avatar?: string;

  @prop({
    required: true,
    minlength: [1, 'Min length for name is 1'],
    maxlength: [15, 'Max length for name is 15']
  })
  public name: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserType
  })
  public userType: UserType;

  @prop({
    required: true,
    default: '',
  })
  public password?: string;

  @prop({
    required: true,
    type: () => String,
  })
  public favorite!: string[];


  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public checkPassword(password: string, salt: string): boolean {
    return createSHA256(password, salt) === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
