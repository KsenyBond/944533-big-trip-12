import TripMainInfoView from "./view/trip-main-info.js";
import TripTabsView from "./view/trip-tabs.js";
import StatisticsView from "./view/statistics.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import {generateEvent, destinations} from "./mock/event.js";
import {availableOffers} from "./mock/offer.js";
import {render, RenderPosition} from "./utils/render.js";
import {EVENTS_NUMBER, MenuItem} from "./const.js";
import {FilterType, UpdateType} from "./const";

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
const siteMenuTabsComponent = new TripTabsView();

render(siteHeaderMainElement, new TripMainInfoView(events), RenderPosition.AFTER_BEGIN);
render(siteHeaderControlsElement, siteMenuTabsComponent, RenderPosition.BEFORE_ELEMENT, siteHeaderControlsHiddenElement);

const tripPresenter = new TripPresenter(siteItineraryElement, eventsModel, destinations, offersModel, filterModel);
const filterPresenter = new FilterPresenter(siteHeaderControlsElement, filterModel, eventsModel);
const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);
const SiteBodyElement = document.querySelector(`.page-main .page-body__container`);

const eventNewFormCloseHandler = () => {
  newEventButtonElement.removeAttribute(`disabled`);
};

const siteMenuTabsClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      tripPresenter.init();

      siteMenuTabsComponent.setMenuItem(MenuItem.TABLE, MenuItem.STATS);

      if (siteItineraryElement.classList.contains(`trip-events--hidden`)) {
        siteItineraryElement.classList.remove(`trip-events--hidden`);
      }
      break;
    case MenuItem.STATS:
      filterModel.changeFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();

      siteMenuTabsComponent.setMenuItem(MenuItem.STATS, MenuItem.TABLE);

      siteItineraryElement.classList.add(`trip-events--hidden`);
      break;
  }
};

siteMenuTabsComponent.setMenuTabsClickHandler(siteMenuTabsClickHandler);

const newEventButtonClickHandler = (evt) => {
  evt.preventDefault();
  newEventButtonElement.setAttribute(`disabled`, `disabled`);

  tripPresenter.destroy();
  filterModel.changeFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createEvent(eventNewFormCloseHandler);
  siteMenuTabsComponent.setMenuItem(MenuItem.TABLE, MenuItem.STATS);

  if (siteItineraryElement.classList.contains(`trip-events--hidden`)) {
    siteItineraryElement.classList.remove(`trip-events--hidden`);
  }
};

newEventButtonElement.addEventListener(`click`, newEventButtonClickHandler);

filterPresenter.init();
// tripPresenter.init();
render(SiteBodyElement, new StatisticsView(), RenderPosition.BEFORE_END);
