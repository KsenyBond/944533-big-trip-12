import Observer from "../utils/observer.js";

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = null;
  }

  set offers(offers) {
    this._offers = offers;
  }

  get offers() {
    return this._offers;
  }
}
