import {
  IsDateString,
  IsMongoId,
  IsNumber,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';
import { CreateCommentMessages } from './create-comment-message.js';


export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(5, 1024, { message: 'min is 5, max is 1024 ' })
  public text!: string;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId!: string;

  public author!: string;

  @IsDateString({}, { message: CreateCommentMessages.date.invalidFormat })
  public date!: Date;

  @IsNumber({ maxDecimalPlaces: 1 }, { message: CreateCommentMessages.rating.invalidFormat })
  @Min(1, { message: CreateCommentMessages.rating.invalidNumber })
  @Max(5, { message: CreateCommentMessages.rating.invalidNumber })
  public rating!: number;
}
