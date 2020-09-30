import he from "he";
import AbstractView from "./abstract.js";
import {transformToTime, transformToDatetimeAttr, generateDurationDHM, formatTypeName} from "../utils/common.js";
import {TRANSFER_TYPES, MAX_SHOWN_OFFERS_NUMBER} from "../const.js";

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

  const preposition = TRANSFER_TYPES.includes(type) ? `to` : `in`;
  const start = transformToTime(startTime);
  const end = transformToTime(endTime);
  const datetimeStart = `${transformToDatetimeAttr(startTime)}T${start}`;
  const datetimeEnd = `${transformToDatetimeAttr(endTime)}T${end}`;
  const durationDHM = generateDurationDHM(event.endTime - event.startTime);
  const selectedOffersTemplate = createEventSelectedOffersTemplate(offers.length > 3 ? offers.slice(0, MAX_SHOWN_OFFERS_NUMBER) : offers);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${formatTypeName(type)} ${preposition} ${destination.name}</h3>

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

    this._rolloutClickHandler = this._rolloutClickHandler.bind(this);
  }

  get template() {
    return createEventTemplate(this._event);
  }

  _rolloutClickHandler(evt) {
    evt.preventDefault();
    this._callback.rolloutClick();
  }

  setRolloutClickHandler(callback) {
    this._callback.rolloutClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rolloutClickHandler);
  }
}
