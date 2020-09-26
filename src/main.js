import TripTabsView from "./view/trip-tabs.js";
import StatisticsView from "./view/statistics.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from './model/destinations.js';
import {render, RenderPosition, removeElement} from "./utils/render.js";
import {MenuItem, FilterType, UpdateType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
const api = new Api(END_POINT, AUTHORIZATION);

const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);

api.destination
  .then((destination) => {
    destinationsModel.destination = destination;
    return api.offers;
  })
  .then((offers) => {
    offersModel.offers = offers;
    api.events
      .then((events) => {
        eventsModel.setEvents(UpdateType.INIT, events);
        render(siteHeaderControlsElement, siteMenuTabsComponent, RenderPosition.BEFORE_ELEMENT, siteHeaderControlsHiddenElement);
        siteMenuTabsComponent.setMenuTabsClickHandler(siteMenuTabsClickHandler);
        filterPresenter.init(); // ???
      })
      .catch(() => {
        eventsModel.setEvents(UpdateType.INIT, []);
        render(siteHeaderControlsElement, siteMenuTabsComponent, RenderPosition.BEFORE_ELEMENT, siteHeaderControlsHiddenElement);
        siteMenuTabsComponent.setMenuTabsClickHandler(siteMenuTabsClickHandler);
        filterPresenter.init(); // ???
      });
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    newEventButtonElement.setAttribute(`disabled`, `disabled`); // ???
  });

const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();

const siteHeaderMainElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = siteHeaderMainElement.querySelector(`.trip-main__trip-controls`);
const siteHeaderControlsHiddenElement = siteHeaderMainElement.querySelector(`.trip-controls .visually-hidden:last-child`);
const siteItineraryElement = document.querySelector(`.trip-events`);

const siteMenuTabsComponent = new TripTabsView();

const tripPresenter = new TripPresenter(siteItineraryElement, eventsModel, destinationsModel, offersModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteHeaderControlsElement, filterModel, eventsModel);

// const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);
const SiteBodyElement = document.querySelector(`.page-main .page-body__container`);

const eventNewFormCloseHandler = () => {
  newEventButtonElement.removeAttribute(`disabled`);
};

let statisticsComponent = null;

const siteMenuTabsClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      removeElement(statisticsComponent);
      tripPresenter.init();

      siteMenuTabsComponent.setMenuItem(MenuItem.TABLE, MenuItem.STATS);

      // if (siteItineraryElement.classList.contains(`trip-events--hidden`)) {
      //   siteItineraryElement.classList.remove(`trip-events--hidden`);
      // }
      break;
    case MenuItem.STATS:
      filterModel.changeFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();

      statisticsComponent = new StatisticsView(eventsModel.events);
      render(SiteBodyElement, statisticsComponent, RenderPosition.BEFORE_END);

      siteMenuTabsComponent.setMenuItem(MenuItem.STATS, MenuItem.TABLE);

      // siteItineraryElement.classList.add(`trip-events--hidden`);
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
  filterModel.changeFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createEvent(eventNewFormCloseHandler);
  siteMenuTabsComponent.setMenuItem(MenuItem.TABLE, MenuItem.STATS);

  // if (siteItineraryElement.classList.contains(`trip-events--hidden`)) {
  //   siteItineraryElement.classList.remove(`trip-events--hidden`);
  // }
};

newEventButtonElement.addEventListener(`click`, newEventButtonClickHandler);

// filterPresenter.init();
tripPresenter.init();
