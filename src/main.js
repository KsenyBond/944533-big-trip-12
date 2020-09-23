import TripMainInfoView from "./view/trip-main-info.js";
import TripTabsView from "./view/trip-tabs.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import {generateEvent} from "./mock/event.js";
import {availableOffers} from "./mock/offer.js";
import {render, RenderPosition} from "./utils/render.js";
import {EVENTS_NUMBER} from "./const.js";

const events = new Array(EVENTS_NUMBER)
  .fill()
  .map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.events = events;

const offersModel = new OffersModel();
offersModel.offers = availableOffers;

const filterModel = new FilterModel();

const siteHeaderMainElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = siteHeaderMainElement.querySelector(`.trip-main__trip-controls`);
const siteHeaderControlsHiddenElement = siteHeaderMainElement.querySelector(`.trip-controls .visually-hidden:last-child`);
const siteItineraryElement = document.querySelector(`.trip-events`);

render(siteHeaderMainElement, new TripMainInfoView(events), RenderPosition.AFTER_BEGIN);
render(siteHeaderControlsElement, new TripTabsView(), RenderPosition.BEFORE_ELEMENT, siteHeaderControlsHiddenElement);

const tripPresenter = new TripPresenter(siteItineraryElement, eventsModel, offersModel, filterModel);
const filterPresenter = new FilterPresenter(siteHeaderControlsElement, filterModel, eventsModel);

filterPresenter.init();
tripPresenter.init();

const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);

newEventButtonElement.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  newEventButtonElement.setAttribute(`disabled`, `disabled`);
  tripPresenter.createEvent(newEventButtonElement);
});
