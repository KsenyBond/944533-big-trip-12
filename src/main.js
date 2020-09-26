import TripMainInfoView from "./view/trip-main-info.js";
import TripTabsView from "./view/trip-tabs.js";
import StatisticsView from "./view/statistics.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from './model/destinations.js';
import {generateEvent} from "./mock/event.js";
import {availableOffers} from "./mock/offer.js";
import {destinations} from "./mock/destination.js";
import {render, RenderPosition, removeElement} from "./utils/render.js";
import {EVENTS_NUMBER, MenuItem, FilterType, UpdateType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const events = new Array(EVENTS_NUMBER)
  .fill()
  .map(generateEvent);

const api = new Api(END_POINT, AUTHORIZATION);

api.events.then((events) => {
  // console.log(events);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

const eventsModel = new EventsModel();
eventsModel.events = events;

const offersModel = new OffersModel();
offersModel.offers = availableOffers;

const filterModel = new FilterModel();

const destinationsModel = new DestinationsModel();
destinationsModel.destination = destinations;

const siteHeaderMainElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = siteHeaderMainElement.querySelector(`.trip-main__trip-controls`);
const siteHeaderControlsHiddenElement = siteHeaderMainElement.querySelector(`.trip-controls .visually-hidden:last-child`);
const siteItineraryElement = document.querySelector(`.trip-events`);
const siteMenuTabsComponent = new TripTabsView();

render(siteHeaderMainElement, new TripMainInfoView(events), RenderPosition.AFTER_BEGIN);
render(siteHeaderControlsElement, siteMenuTabsComponent, RenderPosition.BEFORE_ELEMENT, siteHeaderControlsHiddenElement);

const tripPresenter = new TripPresenter(siteItineraryElement, eventsModel, destinationsModel, offersModel, filterModel);
const filterPresenter = new FilterPresenter(siteHeaderControlsElement, filterModel, eventsModel);
const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);
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

      if (siteItineraryElement.classList.contains(`trip-events--hidden`)) {
        siteItineraryElement.classList.remove(`trip-events--hidden`);
      }
      break;
    case MenuItem.STATS:
      filterModel.changeFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();

      statisticsComponent = new StatisticsView(eventsModel.events);
      render(SiteBodyElement, statisticsComponent, RenderPosition.BEFORE_END);

      siteMenuTabsComponent.setMenuItem(MenuItem.STATS, MenuItem.TABLE);

      siteItineraryElement.classList.add(`trip-events--hidden`);
      break;
  }
};

siteMenuTabsComponent.setMenuTabsClickHandler(siteMenuTabsClickHandler);

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

  if (siteItineraryElement.classList.contains(`trip-events--hidden`)) {
    siteItineraryElement.classList.remove(`trip-events--hidden`);
  }
};

newEventButtonElement.addEventListener(`click`, newEventButtonClickHandler);

filterPresenter.init();
tripPresenter.init();
