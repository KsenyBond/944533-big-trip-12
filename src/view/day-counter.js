import AbstractView from "./abstract.js";
import {transformToDatetime, transformToMonthDay} from "../utils/common.js";
import {SortTypes} from "../const.js";

const createTripDayCounterTemplate = (uniqueDate, index, sortType) => {
  const datetime = transformToDatetime(uniqueDate);
  const monthDay = transformToMonthDay(datetime);

  return (
    `<div class="day__info">
      ${sortType === SortTypes.EVENT ?
      `<span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${datetime}">
        ${monthDay}
      </time>` : ``}
    </div>`
  );
};

export default class TripDayCounter extends AbstractView {
  constructor(uniqueDate, index, currentSortType) {
    super();
    this._uniqueDate = uniqueDate;
    this._index = index;
    this._currentSortType = currentSortType;
  }

  get template() {
    return createTripDayCounterTemplate(this._uniqueDate, this._index, this._currentSortType);
  }
}
