import {availableOffers} from "./offer.js";
import {getRandomInteger, generateValue} from "../utils/common.js";
import {TRANSFER_TYPES, MINUTES_IN_DAY, MAX_SELECTED_OFFERS_NUMBER,
  DESTINATION_PHOTOS, MAX_DAYS_GAP, EVENT_TYPES, EVENT_DESTINATIONS, DESTINATION_DESCRIPTION} from "../const.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateType = () => {
  return {
    name: generateValue(EVENT_TYPES),
    transfer: EVENT_TYPES.slice(0, TRANSFER_TYPES),
    activity: EVENT_TYPES.slice(TRANSFER_TYPES),
  };
};

const generateDestination = (selectedPlace) => {
  const generateRandomDescription = () => {
    return DESTINATION_DESCRIPTION[getRandomInteger(0, DESTINATION_DESCRIPTION.length - 1)];
  };

  const generateRandomPhotos = () => {
    return `http://picsum.photos/248/152?r=${Math.random()}`;
  };

  const destinationDescription =
    new Array(getRandomInteger(1, 5))
      .fill()
      .map(generateRandomDescription);
  const uniqueDestinationDescription = new Set(destinationDescription);

  return {
    place: selectedPlace || generateValue(EVENT_DESTINATIONS),
    description: Array.from(uniqueDestinationDescription).join(` `),
    photos: new Array(DESTINATION_PHOTOS).fill().map(generateRandomPhotos),
  };
};

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
  const typeMatchingOffers = offersList.find((element) => element.type === type.name).offers;

  const selectedOffers = [];

  for (const offer of typeMatchingOffers) {
    if (selectedOffers.length < MAX_SELECTED_OFFERS_NUMBER) {
      if (getRandomInteger(0, 1)) {
        selectedOffers.push(offer);
      }
    }
  }

  return selectedOffers;
};

const generateEvent = () => {
  const id = generateId();
  const type = generateType();
  const destination = generateDestination();
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

export {generateId, generateEvent, generateDestination};
