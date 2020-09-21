import {getRandomInteger, generateValue, shuffle} from "../utils/common.js";
import {TRANSFER_TYPES, MINUTES_IN_DAY, MAX_AVAILABLE_OFFERS_NUMBER, MAX_SELECTED_OFFERS_NUMBER,
  DESTINATION_PHOTOS, MAX_DAYS_GAP, eventsTypes, destinations, destinationRandomDescriptions,} from "../const.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateType = () => {
  return {
    name: generateValue(eventsTypes),
    transfer: eventsTypes.slice(0, TRANSFER_TYPES),
    activity: eventsTypes.slice(TRANSFER_TYPES),
  };
};

const generateDestination = (selectedPlace) => {
  const generateRandomDescription = () => {
    return destinationRandomDescriptions[getRandomInteger(0, destinationRandomDescriptions.length - 1)];
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
    place: selectedPlace || generateValue(destinations),
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

const generateOffers = (availableOnly = false) => {
  const offers = {
    luggage: `Add luggage`,
    meal: `Add meal`,
    comfort: `Switch to comfort`,
    seats: `Choose seats`,
    train: `Travel by train`,
    tickets: `Book tickets`,
    lunch: `Lunch in city`,
  };
  const allOffers = [];

  for (const offerType of Object.keys(offers)) {
    allOffers.push({
      type: offerType,
      name: offers[offerType],
      price: getRandomInteger(10, 30),
      isChecked: availableOnly || allOffers.filter((offer) => offer.isChecked).length >= MAX_SELECTED_OFFERS_NUMBER ? false : Boolean(getRandomInteger(0, 1)),
    });
  }

  return shuffle(allOffers).slice(0, getRandomInteger(0, MAX_AVAILABLE_OFFERS_NUMBER));
};

const generateEvent = () => {
  const id = generateId();
  const type = generateType();
  const destination = generateDestination();
  const startTime = generateStartTime();
  const endTime = generateEndTime(startTime);
  const price = getRandomInteger(10, 250);
  const offers = generateOffers();

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

export {generateId, generateEvent, generateOffers, generateDestination};
