import {MAX_SELECTED_OFFERS_NUMBER} from "../const.js";
import AbstractView from "./abstract.js";

const generateDatetime = (time) => {
  time = time.toLocaleString(`en-GB`);

  return `${time.slice(0, 10).split(`/`).reverse().join(`-`)}T${time.slice(12, 17)}`;
};

const generateDurationDHM = (milliseconds) => {
  let days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  let hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  days = days !== 0 ? `${days}D` : ``;
  hours = hours !== 0 ? `${hours}H` : ``;
  minutes = minutes !== 0 ? `${minutes}M` : ``;

  return `${days} ${hours} ${minutes}`.trim();
};

const createEventSelectedOffersTemplate = (offers) => {
  offers = offers.length > 3 ? offers.slice(0, MAX_SELECTED_OFFERS_NUMBER) : offers;

  const selectedOffers = offers.map((offer) =>
    `<li class="event__offer">
      <span class="event__offer-title">${offer.name}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>`);
  const selectedUniqueOffers = new Set(selectedOffers);

  return Array.from(selectedUniqueOffers).join(``);
};

const createEventTemplate = (event) => {
  const {type, destination, startTime, endTime, duration, price, offers} = event;

  const typeName = type.name;
  const preposition = type.transfer.includes(typeName) ? `to` : `in`;
  const iconType = typeName.toLowerCase();
  const start = startTime.toLocaleTimeString(`en-GB`).slice(0, -3);
  const end = endTime.toLocaleTimeString(`en-GB`).slice(0, -3);
  const datetimeStart = generateDatetime(startTime);
  const datetimeEnd = generateDatetime(endTime);
  const durationDHM = generateDurationDHM(duration);
  const selectedOffersTemplate = createEventSelectedOffersTemplate(offers.filter((offer) => offer.isChecked));

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
          &euro;&nbsp;<span class="event__price-value">${price}</span>
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
