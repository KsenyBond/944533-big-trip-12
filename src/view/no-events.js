import {createElement} from "../utils.js";

const createNoEventsTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class NoEvents {
  constructor() {
    this._element = null;
  }

  get template() {
    return createNoEventsTemplate();
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
