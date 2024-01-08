import { Expose } from 'class-transformer';
import { City } from '../../../types/city.type.js';
import { Housing } from '../../../types/housing.type.js';

export class OfferRdo {
  @Expose()
  public id!: string;

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
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingType!: Housing;

  @Expose()
  public price!: number;

  @Expose()
  public commentsCount!: number;
}
