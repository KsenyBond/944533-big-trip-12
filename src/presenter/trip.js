import SortView from "../view/sort.js";
import TripDaysView from "../view/trip-days.js";
import TripDayView from "../view/trip-day.js";
import TripDayCounterView from "../view/day-counter.js";
import TripEventsListView from "../view/trip-events-list.js";
import NoEventsView from "../view/no-events.js";
import EventPresenter from "./event.js";
import EventNewPresenter from "./event-new.js";
import {render, RenderPosition, removeElement} from "../utils/render.js";
import {sortTimeDown, sortPriceDown, transformToLocaleDate} from "../utils/common.js";
import {filter} from "../utils/filter.js";
import {SortType, UserAction, UpdateType} from "../const.js";

export default class Trip {
  constructor(tripEventsContainer, eventsModel, destinations, offersModel, filterModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;
    this._destinations = destinations;
    this._currentSortType = SortType.EVENT;
    this._eventsPresenter = {};
    this._tripDaysList = [];

    this._sortComponent = null;

    this._tripDaysComponent = new TripDaysView();
    this._noEventsComponent = new NoEventsView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._tripEventsContainer, this._handleViewAction, this._noEventsComponent, this._getEvents(), this._destinations, this._offersModel);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip(true);

    removeElement(this._tripDaysComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent(eventNewFormCloseHandler) {
    this._eventNewPresenter.init(this._tripDaysComponent, eventNewFormCloseHandler);
  }

  _getEvents() {
    const filterType = this._filterModel.filter;
    const events = this._eventsModel.events;
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortTimeDown);
      case SortType.PRICE:
        return filteredEvents.sort(sortPriceDown);
    }

    return filteredEvents;
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventsPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, update) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._eventsPresenter[update.id].init(update);
        break;
      case UpdateType.MAJOR:
        if (update && typeof update === `boolean`) {
          this._currentSortType = SortType.EVENT;
        }

        this._clearTrip();
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._clearTrip();
    this._renderTrip();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTER_BEGIN);
  }

  _clearTrip(resetSortType = false) {
    this._tripDaysList.forEach((tripDay) => removeElement(tripDay));
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventsPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventsPresenter = {};

    removeElement(this._sortComponent);
    removeElement(this._noEventsComponent);

    if (resetSortType) {
      this._currentSortType = SortType.EVENT;
    }
  }

  _renderTripDays() {
    render(this._tripEventsContainer, this._tripDaysComponent, RenderPosition.BEFORE_END);
    this._renderTripDay();
  }

  _renderTripDay() {
    const eventsDates = this._getEvents()
      .map((event) => transformToLocaleDate(event));
    let eventsUniqueDates = Array.from(new Set(eventsDates));
    if (this._currentSortType !== SortType.EVENT) {
      eventsUniqueDates = [``];
    }

    eventsUniqueDates.forEach((uniqueDate, index) => {
      this._tripDayComponent = new TripDayView();
      render(this._tripDaysComponent, this._tripDayComponent, RenderPosition.BEFORE_END);
      this._renderDayCounter(uniqueDate, index);
      this._renderEventsList(uniqueDate);
      this._tripDaysList.push(this._tripDayComponent);
    });
  }

  _renderDayCounter(uniqueDate, index) {
    this._dayCounterComponent = new TripDayCounterView(uniqueDate, index, this._currentSortType);
    render(this._tripDayComponent, this._dayCounterComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderEventsList(uniqueDate) {
    this._eventsListComponent = new TripEventsListView();
    render(this._tripDayComponent, this._eventsListComponent, RenderPosition.BEFORE_END);
    let uniqueDateEvents = this._getEvents().filter((event) => transformToLocaleDate(event) === uniqueDate);
    if (this._currentSortType !== SortType.EVENT) {
      uniqueDateEvents = this._getEvents();
    }
    uniqueDateEvents.forEach((uniqueDateEvent) => {
      this._renderEvent(this._eventsListComponent, uniqueDateEvent);
    });
  }

  _renderEvent(eventsList, event) {
    const eventPresenter = new EventPresenter(eventsList, this._handleViewAction, this._handleModeChange, this._destinations, this._offersModel);
    eventPresenter.init(event);
    this._eventsPresenter[event.id] = eventPresenter;
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent, RenderPosition.BEFORE_END);
  }

  _renderTrip() {
    if (!this._getEvents().length) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    this._renderTripDays();
  }
}
