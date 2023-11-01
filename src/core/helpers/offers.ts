import { Offer } from '../../types/offer.type.js';
import { City } from '../../types/city.type.js';
import { Coordinates } from '../../types/coordinates.type.js';
import { Housing } from '../../types/housing.type.js';
import { Facility } from '../../types/facility.type.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    publishDate,
    city,
    previewImage,
    images,
    isPremium,
    isFavourite,
    rating,
    housingType,
    roomsNumber,
    guestsNumber,
    price,
    facilities,
    authorId,
    commentsIds,
    coordinates
  ] = offerData.replace('\n', '').split('\t');

  const commentsIdsParsed = commentsIds.split(';').filter((comment) => comment.length > 0);
  const stringToBoolean = (s: string): boolean => s === 'true';
  const coordinatesArray = coordinates.split(';').map((coordinate) => parseFloat(coordinate));
  const coordinatesParsed: Coordinates = { latitude: coordinatesArray[0], longitude: coordinatesArray[1] };

  return {
    title,
    description,
    publishDate: new Date(publishDate),
    city: city as City,
    previewImage,
    images:  images.split(';'),
    isPremium: stringToBoolean(isPremium),
    isFavourite: stringToBoolean(isFavourite),
    rating: parseFloat(rating),
    housingType: Housing[housingType as keyof typeof Housing],
    roomsNumber: parseInt(roomsNumber, 10),
    guestsNumber: parseInt(guestsNumber, 10),
    price: parseFloat(price),
    facilities: facilities.split(';').map((facility) => Facility[facility as keyof typeof Facility]),
    authorId,
    commentsIds: commentsIdsParsed,
    commentsNumber: commentsIdsParsed.length,
    coordinates: coordinatesParsed
  } as Offer;
}
