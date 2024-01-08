import { inject, injectable } from 'inversify';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller } from '../../core/controller/controller.js';
import { Component } from '../../types/component.type.js';
import { LoggerType } from '../../core/logger/logger.type.js';
import { CommentService } from './comment.service.js';
import { OfferService } from '../offer/offer.service.js';
import { HttpMethod } from '../../types/http-method.type.js';
import { HttpError } from '../../core/http/http-error.type.js';
import { fillDTO } from '../../core/helpers/common.js';
import { CommentRdo } from './rdo/comment-rdo.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { ValidateDtoMiddleware } from '../../core/middleware/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../core/middleware/private-route.middleware.js';
import { ValidateObjectIdMiddleware } from '../../core/middleware/validate-objectId.middleware.js';

@injectable()
export class CommentController extends Controller {
  constructor(
    @inject(Component.Logger) protected readonly logger: LoggerType,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
  }

  public async create({ body, tokenPayload }: Request, res: Response): Promise<void> {
    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError (
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found`,
        'CommentController'
      );
    }

    const comment = await this.commentService.createForOffer({ ...body, userId: tokenPayload.id });
    await this.offerService.incComment(body.offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
