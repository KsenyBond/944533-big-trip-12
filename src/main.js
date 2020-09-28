import TripTabsView from "./view/trip-tabs.js";
import StatisticsView from "./view/statistics.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import {render, RenderPosition, removeElement} from "./utils/render.js";
import {MenuItem, FilterType, UpdateType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic hS2sd3bfSysl1nb2h`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const siteHeaderMainElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = siteHeaderMainElement.querySelector(`.trip-main__trip-controls`);
const siteHeaderControlsHiddenElement = siteHeaderMainElement.querySelector(`.trip-controls .visually-hidden:last-child`);
const siteItineraryElement = document.querySelector(`.trip-events`);
const newEventButtonElement = siteHeaderMainElement.querySelector(`.trip-main__event-add-btn`);
const SiteBodyElement = document.querySelector(`.page-main .page-body__container`);

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();

const siteMenuTabsComponent = new TripTabsView();

const tripPresenter = new TripPresenter(siteItineraryElement, eventsModel, destinationsModel, offersModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteHeaderControlsElement, filterModel, eventsModel);

let statisticsComponent = null;

const eventNewFormCloseHandler = () => {
  newEventButtonElement.removeAttribute(`disabled`);
};

const resetView = (toDefault = true) => {
  if (toDefault) {
    filterModel.changeFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    siteMenuTabsComponent.setMenuItem(MenuItem.TABLE, MenuItem.STATS);
  } else {
    filterModel.changeFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    siteMenuTabsComponent.setMenuItem(MenuItem.STATS, MenuItem.TABLE);
  }
};

const siteMenuTabsClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      removeElement(statisticsComponent);
      resetView();
      tripPresenter.init();

      if (siteItineraryElement.classList.contains(`trip-events--hidden`)) {
        siteItineraryElement.classList.remove(`trip-events--hidden`);
      }
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      removeElement(statisticsComponent);
      resetView(false);
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(SiteBodyElement, statisticsComponent, RenderPosition.BEFORE_END);

      siteItineraryElement.classList.add(`trip-events--hidden`);
      break;
  }
};

const newEventButtonClickHandler = (evt) => {
  evt.preventDefault();
  newEventButtonElement.setAttribute(`disabled`, `disabled`);

  if (statisticsComponent !== null) {
    removeElement(statisticsComponent);
  }

  tripPresenter.destroy();
  resetView();
  tripPresenter.init();
  tripPresenter.createEvent(eventNewFormCloseHandler);

  if (siteItineraryElement.classList.contains(`trip-events--hidden`)) {
    siteItineraryElement.classList.remove(`trip-events--hidden`);
  }
};

filterPresenter.init();
tripPresenter.init();

newEventButtonElement.addEventListener(`click`, newEventButtonClickHandler);

const prepareTabsAndFilters = () => {
  render(siteHeaderControlsElement, siteMenuTabsComponent, RenderPosition.BEFORE_ELEMENT, siteHeaderControlsHiddenElement);
  siteMenuTabsComponent.setMenuTabsClickHandler(siteMenuTabsClickHandler);
  filterPresenter.init();
};

const setData = async () => {
  const destinationsLoaded = await api.getDestination()
    .then((destination) => {
      destinationsModel.setDestinations(destination);
    });
  const offersLoaded = await api.getOffers()
    .then((offers) => {
      offersModel.setOffers(offers);
    });
  const eventsLoaded = await api.getEvents()
    .then((events) => {
      eventsModel.setEvents(UpdateType.INIT, events);
      prepareTabsAndFilters();
    })
    .catch(() => {
      eventsModel.setEvents(UpdateType.INIT, []);
      prepareTabsAndFilters();
    });
};

setData();

