import { Expose } from 'class-transformer';
import { City } from '../../../types/city.type.js';
import { Housing } from '../../../types/housing.type.js';
import { Facility } from '../../../types/facility.type.js';
import { UserType } from '../../../types/user.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';

export class FullOfferRdo {
  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public date!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewImg!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingType!: Housing;

  @Expose()
  public roomsCount!: number;

  @Expose()
  public guestCount!: number;

  @Expose()
  public cost!: number;

  @Expose()
  public facilities!: Facility[];

  @Expose()
  public author!: UserType;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public coordinates!: Coordinates;
}
