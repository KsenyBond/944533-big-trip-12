import Observer from "../utils/observer.js";
import {FilterType} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  changeFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  get filter() {
    return this._activeFilter;
  }
}
