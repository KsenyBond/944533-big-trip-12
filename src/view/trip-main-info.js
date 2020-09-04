import AbstractView from "./abstract.js";

const createTripDatesTemplate = (allEvents) => {
  return `${allEvents.length > 0 ?
    `<p class="trip-info__dates">${allEvents[0].startTime.toDateString().slice(4, 10)}
    &nbsp;&mdash;&nbsp;${allEvents[allEvents.length - 1].endTime.toDateString().slice(8, 10)}</p>`
    : ``}`;
};

const createTripTitleTemplate = (allEvents) => {
  return `${allEvents.length > 0 ?
    `<h1 class="trip-info__title">${allEvents[0].destination.place} &mdash; ... &mdash; ${allEvents[allEvents.length - 1].destination.place}</h1>`
    : ``}`;
};

const createTripMainInfoTemplate = (events = []) => {
  const [...allEvents] = events;

  const tripTitleTemplate = createTripTitleTemplate(allEvents);
  const tripDatesTemplate = createTripDatesTemplate(allEvents);
  const totalCostMain = allEvents.length > 0 ? allEvents.reduce((sum, current) => sum + current.price, 0) : 0;
  const totalCostSelectedOffers = allEvents.length > 0 ? allEvents.map((event) => event.offers).filter((offer) => offer.isChecked).reduce((sum, current) => sum + current.price, 0) : 0;
  // const totalCostSelectedOffers = allEvents.length > 0 ? allEvents.map((event) => Object.values(event.offers)).filter((offer) => offer.isChecked).reduce((sum, current) => sum + current.price, 0) : 0;
  const totalCoat = totalCostMain + totalCostSelectedOffers;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        ${tripTitleTemplate}

        ${tripDatesTemplate}
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCoat}</span>
      </p>
    </section>`
  );
};

export default class TripMainInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  get template() {
    return createTripMainInfoTemplate(this._events);
  }
}
