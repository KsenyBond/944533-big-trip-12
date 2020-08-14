const createEventTypeItemsTemplate = (typesList, currentType) => {
  return typesList.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${currentType === type ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`).join(``);
};

const createButtonsTemplate = (destination) => {
  return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    ${destination ?
    `<button class="event__reset-btn" type="reset">Delete</button>
     <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    : `<button class="event__reset-btn" type="reset">Cancel</button>`}`;
};

const createAvailableOffersTemplate = (offers) => {
  const availableOffers = offers.available.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type}" ${offers.selected.some((selected) => selected.name === offer.name) ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${offer.type}-1">
        <span class="event__offer-title">${offer.name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`);
  const availableUniqueOffers = new Set(availableOffers);

  return `${offers.available.length ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${Array.from(availableUniqueOffers).join(``)}
      </div>
    </section>` : ``}`;
};

const createDestinationInfoTemplate = (destination) => {
  return `${destination.description ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
        </div>
      </div>
    </section>` : ``}`;
};

const createEventEditTemplate = (event = {}) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const {
    type = {
      name: `Bus`,
      transfer: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
      activity: [`Check-in`, `Sightseeing`, `Restaurant`],
    },
    destination = {
      place: ``,
      description: ``,
      photos: ``,
    },
    startTime = currentDate,
    endTime = currentDate,
    price = ``,
    offers = {
      available: []
    }
  } = event;

  const typeName = type.name;
  const preposition = type.transfer.includes(typeName) ? `to` : `in`;
  const iconType = typeName.toLowerCase();
  const transferTypesTemplate = createEventTypeItemsTemplate(type.transfer, type.name);
  const activityTypesTemplate = createEventTypeItemsTemplate(type.activity, type.name);
  const start = `${startTime.toLocaleDateString(`en-GB`, {day: `2-digit`, month: `2-digit`, year: `2-digit`})} ${startTime.toLocaleTimeString(`en-GB`, {hour: `2-digit`, minute: `2-digit`})}`;
  const end = `${endTime.toLocaleDateString(`en-GB`, {day: `2-digit`, month: `2-digit`, year: `2-digit`})} ${endTime.toLocaleTimeString(`en-GB`, {hour: `2-digit`, minute: `2-digit`})}`;
  const buttonsTemplate = createButtonsTemplate(destination.place);
  const availableOffersTemplate = createAvailableOffersTemplate(offers);
  const destinationInfoTemplate = createDestinationInfoTemplate(destination);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${iconType}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
            ${typeName} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text"
          name="event-destination" value="${destination.place}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="Saint Petersburg"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
          value="${start}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
          value="${end}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
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

export {createEventEditTemplate};
