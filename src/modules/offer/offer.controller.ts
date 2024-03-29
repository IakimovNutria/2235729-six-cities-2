import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Component } from '../../types/component.type.js';
import { Controller } from '../../core/controller/controller.js';
import { LoggerType } from '../../core/logger/logger.type.js';
import { HttpMethod } from '../../types/http-method.type.js';
import { fillDTO } from '../../core/helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { CommentService } from '../comment/comment.service.js';
import { ValidateObjectIdMiddleware } from '../../core/middleware/validate-objectId.middleware.js';
import { ValidateDtoMiddleware } from '../../core/middleware/validate-dto.middleware.js';
import { ParamOfferId } from '../../types/param-offerid.type.js';
import { DocumentExistsMiddleware } from '../../core/middleware/document-exists.js';
import { PrivateRouteMiddleware } from '../../core/middleware/private-route.middleware.js';
import UserService from '../user/user.service.js';
import { UploadFileMiddleware } from '../../core/middleware/upload-file.middleware.js';
import { ConfigSchema, ConfigType } from '../../config/config.type.js';
import { UploadImageResponse } from './rdo/upload-image.rdo.js';
import { FullOfferRdo } from './rdo/full-offer.rdo.js';

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject(Component.Logger) logger: LoggerType,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.Config) private readonly configService: ConfigType<ConfigSchema>,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ]
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremium,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId')
      ]
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.removeFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'RentalOffer', 'offerId')]
    });

    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'preview'),
      ]
    });
  }

  public async index({ params }: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const offers = await this.offerService.find(limit);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    { body, tokenPayload }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({ ...body, author: tokenPayload.id });

    this.created(res, result);
  }

  public async get({ params }: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${params.offerId}`);

    this.ok(res, offer);
  }

  public async update({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async getPremium({ params }: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offer = await this.offerService.findPremiumByCity(`${params.city}`);

    this.ok(res, offer);
  }

  public async addFavorite({ params, tokenPayload }: Request, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(tokenPayload.id, params.offerId);
    this.noContent(res, { message: 'Added to favourites' });
  }

  public async removeFavorite({ params, tokenPayload }: Request, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(tokenPayload.id, params.offerId);
    this.noContent(res, { message: 'Removed from favourites' });
  }

  public async getFavorites({ tokenPayload }: Request, _res: Response): Promise<void> {
    const offers = await this.userService.findFavorites(tokenPayload.id);

    this.ok(_res, fillDTO(OfferRdo, offers));
  }

  public async uploadImage(req: Request, res: Response) {
    const { offerId } = req.params;
    const updateDto = { previewImg: req.file?.filename };

    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageResponse, { updateDto }));
  }
}
