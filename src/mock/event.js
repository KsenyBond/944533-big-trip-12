import {availableOffers} from "./offer.js";
import {destinations} from "./destination.js";
import {getRandomInteger, generateValue} from "../utils/common.js";
import {MINUTES_IN_DAY, MAX_DAYS_GAP, EVENT_TYPES} from "../const.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateStartTime = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  const minutesGap = getRandomInteger(0, MINUTES_IN_DAY - 1);
  const currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);
  currentDate.setMinutes(minutesGap);
  currentDate.setDate(currentDate.getDate() + daysGap);

  return new Date(currentDate);
};

const generateEndTime = (start) => {
  const currentDate = new Date(start.getTime());

  currentDate.setHours(23, 59, 59, 999);

  const minutesGap = getRandomInteger(0, currentDate.getTime() - start.getTime());

  return new Date(start.getTime() + minutesGap);
};

const generateOffers = (type, offersList) => {
  const typeMatchingOffers = offersList.find((element) => element.type === type).offers;

  const selectedOffers = [];

  for (const offer of typeMatchingOffers) {
    if (getRandomInteger(0, 1)) {
      selectedOffers.push(offer);
    }
  }

  return selectedOffers;
};

const generateEvent = () => {
  const id = generateId();
  const type = generateValue(EVENT_TYPES);
  const destination = generateValue(Array.from(destinations.values()));
  const startTime = generateStartTime();
  const endTime = generateEndTime(startTime);
  const price = getRandomInteger(10, 250);
  const offers = generateOffers(type, Array.from(availableOffers.values()));

  return {
    id,
    type,
    destination,
    startTime,
    endTime,
    price,
    offers,
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

export {generateId, generateEvent, generateOffers};
