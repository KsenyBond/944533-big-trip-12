import {getRandomInteger, generateValue} from "../utils/common.js";
import {EVENT_TYPES, EVENT_OFFERS, MIN_NUMBER, MAX_AVAILABLE_OFFERS_NUMBER, MIN_OFFER_PRICE, MAX_OFFER_PRICE} from "../const.js";

const availableOffers = new Map();

const EVENT_OFFERS_LIST = EVENT_OFFERS.map(function (offer) {
  return {
    title: offer,
    price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE)
  };
});

EVENT_TYPES.forEach((type) => {
  let uniqueOffers = new Set();
  const offersNumber = getRandomInteger(MIN_NUMBER, MAX_AVAILABLE_OFFERS_NUMBER);

  for (let i = 0; i < offersNumber; i++) {
    uniqueOffers.add(generateValue(EVENT_OFFERS_LIST));
  }

  const offers = Array.from(uniqueOffers);

  availableOffers.set(type, {type, offers});
});

export {availableOffers};
