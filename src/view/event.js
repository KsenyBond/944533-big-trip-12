import he from 'he';
import AbstractView from "./abstract.js";
import {transformToTime, transformToDatetimeAttr, generateDurationDHM} from "../utils/common.js";

const createEventSelectedOffersTemplate = (offers) => {
  return offers.map((offer) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  }).join(``);
};

const createEventTemplate = (event) => {
  const {type, destination, startTime, endTime, price, offers} = event;

  const typeName = type.name;
  const preposition = type.transfer.includes(typeName) ? `to` : `in`;
  const iconType = typeName.toLowerCase();
  const start = transformToTime(startTime);
  const end = transformToTime(endTime);
  const datetimeStart = `${transformToDatetimeAttr(startTime)}T${start}`;
  const datetimeEnd = `${transformToDatetimeAttr(endTime)}T${end}`;
  const durationDHM = generateDurationDHM(event.endTime - event.startTime);
  const selectedOffersTemplate = createEventSelectedOffersTemplate(offers);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${iconType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeName} ${preposition} ${destination.place}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${datetimeStart}>${start}</time>
            &mdash;
            <time class="event__end-time" datetime=${datetimeEnd}>${end}</time>
          </p>
          <p class="event__duration">${durationDHM}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(price.toString())}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffersTemplate}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractView {
  constructor(event) {
    super();
    this._event = event;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
  }

  get template() {
    return createEventTemplate(this._event);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }
}
