const TRANSFER_TYPES_NUMBER = 7;
const MAX_SHOWN_OFFERS_NUMBER = 3;

const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
const TRANSFER_TYPES = EVENT_TYPES.slice(0, TRANSFER_TYPES_NUMBER);
const ACTIVITY_TYPES = EVENT_TYPES.slice(TRANSFER_TYPES_NUMBER);

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

export {MAX_SHOWN_OFFERS_NUMBER, EVENT_TYPES, TRANSFER_TYPES, ACTIVITY_TYPES, SortType, UserAction,
  UpdateType, FilterType, MenuItem};
