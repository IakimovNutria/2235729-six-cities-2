import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentServiceType } from './comment-service.type.js';
import { Component } from '../../types/component.type';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { Sort } from '../../types/sort.type';

const COMMENTS_COUNT = 50;
@injectable()
export class CommentService implements CommentServiceType {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface
  ) {
  }

  public async createForOffer(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    const offerId = dto.offerId;
    await this.offerService.incComment(offerId);

    const allRating = this.commentModel.find({ offerId }).select('rating');
    const offer = await this.offerService.findById(offerId);

    const count = offer?.commentsCount ?? 1;
    const newRating = allRating['rating'] / (count);
    await this.offerService.updateRating(offerId, newRating);
    return comment.populate('authorId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: Sort.Down })
      .populate('authorId')
      .limit(COMMENTS_COUNT);
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }
}
