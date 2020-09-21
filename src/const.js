const TRANSFER_TYPES = 7;
const MINUTES_IN_DAY = 1440;
const MAX_SELECTED_OFFERS_NUMBER = 3;
const MAX_AVAILABLE_OFFERS_NUMBER = 5;
const DESTINATION_PHOTOS = 5;
const MAX_DAYS_GAP = 1;
const EVENTS_NUMBER = 15;
const SortTypes = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};
const eventsTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

const destinations = [
  `Rome`,
  `Florence`,
  `Verona`,
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

const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

const UpdateType = {
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export {TRANSFER_TYPES, MINUTES_IN_DAY, MAX_SELECTED_OFFERS_NUMBER, MAX_AVAILABLE_OFFERS_NUMBER,
  DESTINATION_PHOTOS, MAX_DAYS_GAP, EVENTS_NUMBER, SortTypes, eventsTypes, destinations, destinationRandomDescriptions,
  UserAction, UpdateType, FilterType};
