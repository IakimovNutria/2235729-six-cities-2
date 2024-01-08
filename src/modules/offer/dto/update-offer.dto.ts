import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  Max,
  IsEnum,
  ArrayNotEmpty,
} from 'class-validator';
import { City } from '../../../types/city.type.js';
import { Housing } from '../../../types/housing.type.js';
import { Facility } from '../../../types/facility.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { CreateOfferMessage } from './create-offer-message.js';
import { imageRegExp } from '../../../constants/image.js';

export class UpdateOfferDto{
  @IsOptional()
  @MinLength(10, { message: CreateOfferMessage.name.minLength })
  @MaxLength(100, { message: CreateOfferMessage.name.maxLength })
    name?: string;

  @IsOptional()
  @MinLength(20, { message: CreateOfferMessage.name.minLength })
  @MaxLength(1024, { message: CreateOfferMessage.name.maxLength })
    description?: string;

  @IsOptional()
  @IsDateString({}, { message: CreateOfferMessage.date.invalidFormat })
    date?: Date;

  @IsOptional()
  @IsString({ message: CreateOfferMessage.city.invalidFormat })
    city?: City;

  @IsOptional()
  @IsString({ message: CreateOfferMessage.previewImg.invalidFormat })
  @Matches(imageRegExp, { message: CreateOfferMessage.previewImg.invalidFormat })
    previewImg?: string;

  @IsOptional()
  @IsArray({ message: CreateOfferMessage.images.invalidFormat })
  @Matches(imageRegExp, { each:true, message: CreateOfferMessage.images.invalidItem })
  @ArrayMinSize(6, { message: CreateOfferMessage.images.invalidCount })
  @ArrayMaxSize(6, { message: CreateOfferMessage.images.invalidCount })
    images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateOfferMessage.isPremium.invalidFormat })
    isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: CreateOfferMessage.isFavourites.invalidFormat })
    isFavourite?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: CreateOfferMessage.rating.invalidFormat })
  @Min(1, { message: CreateOfferMessage.rating.invalidNumber })
  @Max(5, { message: CreateOfferMessage.rating.invalidNumber })
    rating?: number;

  @IsOptional()
  @IsString({ message: CreateOfferMessage.housingType.invalidFormat })
  @IsEnum(Housing, { message: CreateOfferMessage.housingType.invalidString })
    housingType?: Housing;

  @IsOptional()
  @IsInt({ message: CreateOfferMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateOfferMessage.roomsCount.invalidNumber })
  @Max(8, { message: CreateOfferMessage.roomsCount.invalidNumber })
    roomsCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  @IsOptional()
  @IsInt({ message: CreateOfferMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferMessage.guestsCount.invalidNumber })
  @Max(10, { message: CreateOfferMessage.guestsCount.invalidNumber })
    guestsCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @IsOptional()
  @IsNumber({}, { message: CreateOfferMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferMessage.price.invalidNumber })
  @Max(10000, { message: CreateOfferMessage.price.invalidNumber })
    price?: number;

  @IsOptional()
  @IsArray({ message: CreateOfferMessage.facilities.invalidFormat })
  @IsEnum(Facility, { each: true, message: CreateOfferMessage.facilities.invalidItem })
  @ArrayNotEmpty({ message: CreateOfferMessage.facilities.notEmpty })
    facilities?: Facility[];

  @IsOptional()
  @IsObject({ message:CreateOfferMessage.coordinates.invalidFormat })
    coordinates?: Coordinates;
}
