import Observer from "../utils/observer.js";

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = null;
  }

  set destination(destinations) {
    this._destinations = destinations;
  }

  get destination() {
    return this._destinations;
  }
}
