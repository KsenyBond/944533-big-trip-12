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

const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

const UpdateType = {
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export {TRANSFER_TYPES, MINUTES_IN_DAY, MAX_SELECTED_OFFERS_NUMBER, MAX_AVAILABLE_OFFERS_NUMBER,
  DESTINATION_PHOTOS, MAX_DAYS_GAP, EVENTS_NUMBER, SortTypes, eventsTypes, UserAction, UpdateType};
