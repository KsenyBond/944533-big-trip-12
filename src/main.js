import {createTripMainInfoTemplate} from "./view/trip-main-info.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createEventEditTemplate} from "./view/event-edit.js";
import {createDestinationTemplate} from "./view/destination.js";
import {createItineraryTemplate} from "./view/itinerary.js";
import {createEventTemplate} from "./view/event.js";

const EVENTS_NUMBER = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderMainElement = document.querySelector(`.trip-main`);
const siteHeaderHiddenElement = siteHeaderMainElement.querySelector(`.trip-controls .visually-hidden:last-child`);
const siteMainElement = document.querySelector(`.trip-events`);

render(siteHeaderMainElement, createTripMainInfoTemplate(), `afterbegin`);
render(siteHeaderHiddenElement, createSiteMenuTemplate(), `beforebegin`);
render(siteHeaderHiddenElement, createFilterTemplate(), `afterend`);
render(siteMainElement, createSortingTemplate(), `beforeend`);
render(siteMainElement, createEventEditTemplate(), `beforeend`);

const siteEventDetailsElement = siteMainElement.querySelector(`.event__details`);

render(siteEventDetailsElement, createDestinationTemplate(), `beforeend`);
render(siteMainElement, createItineraryTemplate(), `beforeend`);

const siteItineraryElement = siteMainElement.querySelector(`.trip-days`);

const renderEvent = (count) => {
  for (let i = 0; i < count; i++) {
    render(siteItineraryElement, createEventTemplate(), `beforeend`);
  }
};

renderEvent(EVENTS_NUMBER);
