import TripMainInfoView from "./view/trip-main-info.js";
import TripTabsView from "./view/trip-tabs.js";
import TripFiltersView from "./view/trip-filters.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render.js";
import {EVENTS_NUMBER} from "./const.js";
import TripPresenter from "./presenter/trip.js";

const events = new Array(EVENTS_NUMBER)
  .fill()
  .map(generateEvent)
  .sort((event1, event2) => event1.startTime.getTime() - event2.startTime.getTime());

const siteHeaderMainElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = siteHeaderMainElement.querySelector(`.trip-main__trip-controls`);
const siteHeaderControlsHiddenElement = siteHeaderMainElement.querySelector(`.trip-controls .visually-hidden:last-child`);
const siteItineraryElement = document.querySelector(`.trip-events`);

render(siteHeaderMainElement, new TripMainInfoView(events), RenderPosition.AFTER_BEGIN);
render(siteHeaderControlsElement, new TripTabsView(), RenderPosition.BEFORE_ELEMENT, siteHeaderControlsHiddenElement);
render(siteHeaderControlsElement, new TripFiltersView(), RenderPosition.BEFORE_END);

const tripPresenter = new TripPresenter(siteItineraryElement, events);
tripPresenter.init(events);
