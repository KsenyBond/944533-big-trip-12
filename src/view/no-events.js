import AbstractView from "./abstract.js";

const createNoEventsTemplate = (isDataAvailable) => {
  return `<p class="trip-events__msg">
    ${isDataAvailable ?
    `Click New Event to create your first point`
    : `The server is temporarily unable to service your request. Please try again later.`}
  </p>`;
};

export default class NoEvents extends AbstractView {
  constructor(isDataAvailable) {
    super();
    this._isDataAvailable = isDataAvailable;
  }

  get template() {
    return createNoEventsTemplate(this._isDataAvailable);
  }
}
