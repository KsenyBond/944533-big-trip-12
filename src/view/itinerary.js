import AbstractView from "./abstract.js";

const createTripDaysItemTemplate = (allEvents) => {
  const allEventsDates = allEvents.map((day) => day.startTime.toLocaleDateString(`en-GB`));
  const eventsUniqueDates = Array.from(new Set(allEventsDates));

  return eventsUniqueDates.map((date) =>
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${eventsUniqueDates.indexOf(date) + 1}</span>
        <time class="day__date" datetime="${date.split(`/`).reverse().join(`-`)}">
          ${(new Date(date.split(`/`).reverse().join(`-`))).toDateString().slice(4, 10)}
        </time>
      </div>
      <ul class="trip-events__list" data-datetime="${date.split(`/`).reverse().join(`-`)}">
      </ul>
    </li>`).join(``);
};

const createItineraryTemplate = (events = []) => {
  const [...allEvents] = events;

  const tripDaysItemTemplate = createTripDaysItemTemplate(allEvents);

  return `<ul class="trip-days">
      ${tripDaysItemTemplate}
    </ul>`;
};

export default class Itinerary extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  get template() {
    return createItineraryTemplate(this._events);
  }
}
