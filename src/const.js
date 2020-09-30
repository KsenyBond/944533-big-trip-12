const MAX_SHOWN_OFFERS_NUMBER = 3;

const TRANSFER_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const ACTIVITY_TYPES = [`check-in`, `sightseeing`, `restaurant`];

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`,
  UPDATE_FAVORITES: `UPDATE_FAVORITES`
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

export {MAX_SHOWN_OFFERS_NUMBER, TRANSFER_TYPES, ACTIVITY_TYPES, SortType, UserAction,
  UpdateType, FilterType, MenuItem};
