import {FilterType} from "../const.js";
import {isEventPast, isEventFuture} from "./common.js";

const filter = {
  [FilterType.EVERYTHING]: (events) => Object.assign(events),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.endTime)),
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.startTime))
};

export {filter};
