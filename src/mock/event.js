import {getRandomInteger, generateValue} from "../utils.js";
import {TRANSFER_TYPES, MINUTES_IN_DAY, MAX_SELECTED_OFFERS_NUMBER, MAX_AVAILABLE_OFFERS_NUMBER, DESTINATION_PHOTOS, MAX_DAYS_GAP} from "../const.js";

const generateType = () => {
  const types = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

  return {
    name: generateValue(types),
    transfer: types.slice(0, TRANSFER_TYPES),
    activity: types.slice(TRANSFER_TYPES),
  };
};

const generateDestination = () => {
  const destinations = [
    `Rome`,
    `Florence`,
    `Bergamo`,
    `Venice`
  ];
  const destinationRandomDescriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];

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
    place: generateValue(destinations),
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

const generateDuration = (start, end) => {
  return end.getTime() - start.getTime();
};

const generateRandomOffer = () => {
  const offers = [
    {
      type: `luggage`,
      name: `Add luggage`,
      price: 50
    },
    {
      type: `meal`,
      name: `Add meal`,
      price: 15
    },
    {
      type: `comfort`,
      name: `Switch to comfort`,
      price: 80
    },
    {
      type: `seats`,
      name: `Choose seats`,
      price: 5
    },
    {
      type: `train`,
      name: `Travel by train`,
      price: 40
    }
  ];

  return generateValue(offers);
};

const generateOffers = (selectedCount, availableCount) => {
  return {
    selected: new Array(getRandomInteger(0, selectedCount)).fill().map(generateRandomOffer),
    available: new Array(getRandomInteger(0, availableCount)).fill().map(generateRandomOffer),
  };
};

const generateEvent = () => {
  const type = generateType();
  const destination = generateDestination();
  const startTime = generateStartTime();
  const endTime = generateEndTime(startTime);
  const duration = generateDuration(startTime, endTime);
  const price = getRandomInteger(10, 250);
  const offers = generateOffers(MAX_SELECTED_OFFERS_NUMBER, MAX_AVAILABLE_OFFERS_NUMBER);

  return {
    type,
    destination,
    startTime,
    endTime,
    duration,
    price,
    offers,
  };
};

export {generateEvent};
