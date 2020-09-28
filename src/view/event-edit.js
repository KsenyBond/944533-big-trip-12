import flatpickr from "flatpickr";
import he from "he";
import SmartView from "./smart.js";
import {setNeutralTime, transformToDateAndTime, formatTypeName} from "../utils/common.js";
import {TRANSFER_TYPES, ACTIVITY_TYPES} from "../const.js";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  type: `flight`,
  destination: {
    name: ``,
    description: ``,
    pictures: []
  },
  startTime: setNeutralTime(),
  endTime: setNeutralTime(),
  price: ``,
  offers: [],
  isFavorite: false
};

const FLATPICKR_OPTIONS = {
  'dateFormat': `d/m/Y H:i`,
  'enableTime': true,
  'time_24hr': true,
};

const createEventTypeItemsTemplate = (typesList, currentType) => {
  return typesList.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio"
      name="event-type" value="${type}" ${currentType === type ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${formatTypeName(type)}</label>
    </div>`).join(``);
};

const createButtonsTemplate = (isNewEvent, isFavorite, isSaving, isDeleting, isDisabled) => {
  return `
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>
      ${isSaving ? `Saving...` : `Save`}
    </button>
    ${!isNewEvent ?
    `<button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
      ${isDeleting ? `Deleting...` : `Delete`}
    </button>
     <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox"
     name="event-favorite" ${isFavorite ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>
        <span class="visually-hidden">Open event</span>
      </button>`
    : `<button class="event__reset-btn" type="reset">Cancel</button>`}`;
};

const createAvailableOffersTemplate = (availableOffers, selectedOffers, type, isDisabled) => {
  const availableOffersList = availableOffers.get(type).offers.map((offer) => {
    const id = offer.title.toLowerCase().split(` `).join(`-`);
    const isChecked = selectedOffers.some((selectedOffer) => selectedOffer.title === offer.title) ? `checked` : ``;

    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1"
      type="checkbox" name="event-offer-${id}" data-title="${offer.title}" data-price="${offer.price}"
        ${isChecked} ${isDisabled ? `disabled` : ``}>
      <label class="event__offer-label" for="event-offer-${id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
    );
  });

  return `${availableOffers.get(type).offers.length ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${Array.from(availableOffersList).join(``)}
      </div>
    </section>` : ``}`;
};

const createDestinationTemplate = (possibleDestinations) => {
  return Array.from(possibleDestinations.values()).map((destination) => `<option value="${destination.name}"></option>`).join(``);
};

const createDestinationInfoTemplate = (isNewEvent, destination, possibleDestinations) => {
  return `${!isNewEvent ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${possibleDestinations.get(destination.name).description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${possibleDestinations.get(destination.name).pictures.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(``)}
        </div>
      </div>
    </section>` : ``}`;
};

const createEventEditTemplate = (data, availableOffers, possibleDestinations) => {
  const {type, destination, startTime, endTime, price, offers: selectedOffers,
    isFavorite, isDisabled, isSaving, isDeleting} = data;

  const isNewEvent = !destination.name;
  const preposition = TRANSFER_TYPES.includes(type) ? `to` : `in`;
  const transferTypesTemplate = createEventTypeItemsTemplate(TRANSFER_TYPES, type, formatTypeName);
  const activityTypesTemplate = createEventTypeItemsTemplate(ACTIVITY_TYPES, type, formatTypeName);
  const start = transformToDateAndTime(startTime);
  const end = transformToDateAndTime(endTime);
  const buttonsTemplate = createButtonsTemplate(isNewEvent, isFavorite, isSaving, isDeleting, isDisabled);
  const availableOffersTemplate = createAvailableOffersTemplate(availableOffers, selectedOffers, type, isDisabled);
  const destinationTemplate = createDestinationTemplate(possibleDestinations);
  const destinationInfoTemplate = createDestinationInfoTemplate(isNewEvent, destination, possibleDestinations);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferTypesTemplate}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityTypesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${formatTypeName(type)} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text"
          name="event-destination" value="${destination.name}" list="destination-list-1"
          ${isDisabled ? `disabled` : ``} required>
          <datalist id="destination-list-1">
            ${destinationTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
          value="${start}" ${isDisabled ? `disabled` : ``}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
          value="${end}" ${isDisabled ? `disabled` : ``}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price"
          value="${he.encode(price.toString())}" ${isDisabled ? `disabled` : ``} required>
        </div>
        ${buttonsTemplate}
      </header>
      ${availableOffersTemplate || destinationInfoTemplate ?
      `<section class="event__details">
        ${availableOffersTemplate}
        ${destinationInfoTemplate}
      </section>` : ``}
    </form>`
  );
};

export default class EventEdit extends SmartView {
  constructor(destinationsModel, offersModel, event = BLANK_EVENT) {
    super();
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._data = EventEdit.parseEventToData(event);
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._selectOffersHandler = this._selectOffersHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
  }

  get template() {
    return createEventEditTemplate(this._data, this._offersModel.offers, this._destinationsModel.destination);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setFavoriteChangeHandler(this._callback.favoriteChange);
  }

  reset(event) {
    this.updateData(
        EventEdit.parseEventToData(event)
    );
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventEdit.parseDataToEvent(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventEdit.parseDataToEvent(this._data));
  }

  _favoriteChangeHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteChange();
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: []
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const update = this._destinationsModel.destination.has(evt.target.value)
      ? this._destinationsModel.destination.get(evt.target.value)
      : {
        name: ``,
        description: ``,
        pictures: []
      };

    this.updateData({
      destination: update
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: Number(evt.target.value)
    }, true);
  }

  _selectOffersHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    let update = this._data.offers.slice();

    if (evt.target.checked) {
      update.push({
        title: evt.target.dataset.title,
        price: Number(evt.target.dataset.price)
      });
    } else {
      update = update.filter((offer) => offer.title !== evt.target.dataset.title);
    }

    this.updateData({
      offers: update
    });
  }

  _startDateChangeHandler(selectedDates) {
    const endTime = selectedDates[0] > this._data.endTime ? selectedDates[0] : this._data.endTime;

    this.updateData({
      startTime: selectedDates[0],
      endTime
    });
  }

  _endDateChangeHandler(selectedDates) {
    this.updateData({
      endTime: selectedDates[0]
    });
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.element.addEventListener(`reset`, this._formDeleteClickHandler);
  }

  setFavoriteChangeHandler(callback) {
    const eventFavoriteButton = this.element.querySelector(`.event__favorite-checkbox`);
    this._callback.favoriteChange = callback;

    if (eventFavoriteButton) {
      eventFavoriteButton.addEventListener(`change`, this._favoriteChangeHandler);
    }
  }

  _setInnerHandlers() {
    this.element
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._eventTypeChangeHandler);
    this.element
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
    this.element
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);
    if (this.element.querySelector(`.event__details`)) {
      this.element
        .querySelector(`.event__details`)
        .addEventListener(`change`, this._selectOffersHandler);
    }
  }

  _setDatepickers() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.element.querySelector(`#event-start-time-1`),
        Object.assign(
            {
              defaultDate: this._data.startTime,
              onChange: this._startDateChangeHandler
            },
            FLATPICKR_OPTIONS
        )
    );

    this._endDatepicker = flatpickr(
        this.element.querySelector(`#event-end-time-1`),
        Object.assign(
            {
              minDate: this._data.startTime,
              defaultDate: this._data.endTime,
              onChange: this._endDateChangeHandler
            },
            FLATPICKR_OPTIONS
        )
    );
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
