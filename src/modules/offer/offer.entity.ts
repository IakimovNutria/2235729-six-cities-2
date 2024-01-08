import typegoose, { defaultClasses, getModelForClass, Ref, Severity } from '@typegoose/typegoose';
import { City } from '../../types/city.type.js';
import { Facility } from '../../types/facility.type.js';
import { Housing } from '../../types/housing.type.js';
import { UserEntity } from '../user/user.entity.js';
import { Coordinates } from '../../types/coordinates.type.js';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {

  @prop({
    required: true,
    type: () => String,
    enum: City
  })
  public city!: City;

  @prop({
    default: 0
  })
  public commentsCount!: number;

  @prop({
    required: true,
    min: [100, 'Min cost is 100'],
    max: [100000, 'Max cost is 100000']
  })
  public price!: number;

  @prop({
    required: true,
    minlength: [20, 'Min length for description is 20'],
    maxlength: [1024, 'Max length for description is 1024']
  })
  public description!: string;

  @prop({
    required: true,
    type: () => String,
    enum: Facility
  })
  public facilities!: Facility[];

  @prop({
    required: true,
    min: [1, 'Min count of guests is 1'],
    max: [10, 'Max count of guests is 10']
  })
  public guestsCount!: number;

  @prop({
    required: true,
    type: () => String,
    enum: Housing
  })
  public housingType!: Housing;

  @prop({
    type: () => String,
    minCount: [6, 'Images should be 6'],
    maxCount: [6, 'Images should be 6']
  })
  public images!: string[];

  @prop({
    required: true,
    minlength: [10, 'Min length for name is 10'],
    maxlength: [100, 'Max length for name is 15']
  })
  public name!: string;

  @prop({
    ref: UserEntity,
    required: true
  })
  public author!: Ref<UserEntity>;

  @prop({
    required: true,
    default: false
  })
  public isPremium!: boolean;

  @prop({
    required: true,
    match: [/.*\.(?:jpg|png)/, 'Image must be jpg or png']
  })
  public previewImg!: string;

  @prop({
    required: true
  })
  public date!: Date;

  @prop({
    required: true,
    min: [1, 'Min rating is 1'],
    max: [5, 'Max rating is 5']
  })
  public rating!: number;

  @prop({
    required: true,
    min: [1, 'Min room count is 1'],
    max: [8, 'Max room count is 8']
  })
  public roomsCount!: number;

  @prop({
    required: true,
    allowMixed: Severity.ALLOW
  })
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
