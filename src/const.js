const TRANSFER_TYPES_NUMBER = 7;
const MINUTES_IN_DAY = 1440;
const MIN_NUMBER = 0;
const MAX_AVAILABLE_OFFERS_NUMBER = 5;
const MAX_SHOWN_OFFERS_NUMBER = 3;
const MIN_OFFER_PRICE = 10;
const MAX_OFFER_PRICE = 30;
const DESTINATION_PHOTOS = 5;
const MAX_DAYS_GAP = 1;

const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

const TRANSFER_TYPES = EVENT_TYPES.slice(0, TRANSFER_TYPES_NUMBER);

const ACTIVITY_TYPES = EVENT_TYPES.slice(TRANSFER_TYPES_NUMBER);

const EVENT_OFFERS = [`Add meal`, `Switch to comfort`, `Choose seats`, `Travel by train`, `Book tickets`, `Lunch in city`, `Rent a car`];

const EVENT_DESTINATIONS = [
  `Rome`,
  `Florence`,
  `Verona`,
  `Venice`
];

const DESTINATION_DESCRIPTION = [
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

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

const UpdateType = {
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export {TRANSFER_TYPES, ACTIVITY_TYPES, EVENT_OFFERS, MINUTES_IN_DAY, MIN_NUMBER, MAX_SHOWN_OFFERS_NUMBER,
  MAX_AVAILABLE_OFFERS_NUMBER, MIN_OFFER_PRICE, MAX_OFFER_PRICE, DESTINATION_PHOTOS, MAX_DAYS_GAP,
  SortType, EVENT_TYPES, EVENT_DESTINATIONS, DESTINATION_DESCRIPTION, UserAction, UpdateType, FilterType, MenuItem};
