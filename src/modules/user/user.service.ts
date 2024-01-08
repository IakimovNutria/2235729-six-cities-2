import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { UserEntity } from './user.entity.js';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { Component } from '../../types/component.type.js';
import { LoggerType } from '../../core/logger/logger.type.js';
import { OfferEntity } from '../offer/offer.entity.js';

@injectable()
export default class UserService implements UserServiceInterface {

  constructor(
    @inject(Component.Logger) private readonly logger: LoggerType,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) { }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.userModel.findById(userId).select('favorite');
    if (!offers) {
      return [];
    }

    return this.userModel
      .find({ _id: { $in: offers.favorite } });
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`Новый пользователь создан: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ '_id': userId });
  }

  public async addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, { $push: { favorite: offerId }, new: true });
  }

  public async removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, { $pull: { favorite: offerId }, new: true });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async exists(id: string): Promise <boolean> {
    return (await this.userModel.exists({ _id: id })) !== null;
  }
}
