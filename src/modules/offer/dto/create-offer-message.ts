export const CreateOfferMessage = {
  name: {
    minLength: 'minimum title length must be 10',
    maxLength: 'maximum title length must be 100',
  },
  description: {
    minLength: 'minimum description length must be 20',
    maxLength: 'maximum description length must be 1024',
  },
  date: {
    invalidFormat: 'date must be a valid ISO date',
  },
  city: {
    invalidFormat: 'city must be a valid a string',
  },
  previewImg: {
    invalidFormat: 'previewImg should be .png, .jpeg or .jpg',
  },
  images: {
    invalidFormat: 'images must be an array',
    invalidItem: 'each image should be .png, .jpeg or .jpg',
    invalidCount: 'should be 6 images',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  isFavourites: {
    invalidFormat: 'isFavourites must be a boolean',
  },
  rating: {
    invalidFormat: 'rating must be a number',
    invalidNumber: 'min rating is 1, max is 5',
  },
  housingType: {
    invalidFormat: 'housingType must be a valid a string',
    invalidString: 'housingType must be one of housing',
  },
  roomsCount: {
    invalidFormat: 'roomsCount must be an integer',
    invalidNumber: 'min count of rooms is 1, max is 8',
  },
  guestsCount: {
    invalidFormat: 'guestsCount must be an integer',
    invalidNumber: 'min count of guests is 1, max is 10',
  },
  price: {
    invalidFormat: 'price must be an integer',
    invalidNumber: 'min length is 100, max is 100000',
  },
  facilities: {
    invalidFormat: 'facilities must be an array',
    notEmpty: 'there should be at least 1 facility',
    invalidItem: 'type must be one of the facilities',
  },
  author: {
    invalidId: 'userId field must be a valid id',
  },
  coordinates: {
    invalidFormat: 'coordinates must be a valid a object',
  },
} as const;
