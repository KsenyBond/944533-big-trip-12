import {createTripMainInfoTemplate} from "./view/trip-main-info.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createEventEditTemplate} from "./view/event-edit.js";
import {createItineraryTemplate} from "./view/itinerary.js";
import {createEventTemplate} from "./view/event.js";
import {generateEvent} from "./mock/event.js";

const EVENTS_NUMBER = 16;

const events = new Array(EVENTS_NUMBER)
  .fill()
  .map(generateEvent)
  .sort((event1, event2) => event1.startTime.getTime() - event2.startTime.getTime());

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderMainElement = document.querySelector(`.trip-main`);
const siteHeaderHiddenElement = siteHeaderMainElement.querySelector(`.trip-controls .visually-hidden:last-child`);
const siteMainElement = document.querySelector(`.trip-events`);

render(siteHeaderMainElement, createTripMainInfoTemplate(events), `afterbegin`);
render(siteHeaderHiddenElement, createSiteMenuTemplate(), `beforebegin`);
render(siteHeaderHiddenElement, createFilterTemplate(), `afterend`);
render(siteMainElement, createSortingTemplate(), `beforeend`);
render(siteMainElement, createEventEditTemplate(events[0]), `beforeend`);
render(siteMainElement, createItineraryTemplate(events), `beforeend`);

const checkDay = (time) => {
  return time.toLocaleDateString('en-GB').split(`/`).reverse().join(`-`);
};

const renderEvent = (count) => {

  for (let i = 1; i < count; i++) {
    render(siteMainElement.querySelector(`.day${checkDay(events[i].startTime)}`),
      createEventTemplate(events[i]), `beforeend`);
  }
};

renderEvent(EVENTS_NUMBER);
