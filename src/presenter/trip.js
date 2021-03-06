import SortView from "../view/sort.js";
import TripDaysView from "../view/trip-days.js";
import TripDayView from "../view/trip-day.js";
import TripDayCounterView from "../view/trip-day-counter.js";
import TripEventsListView from "../view/trip-events-list.js";
import NoEventsView from "../view/no-events.js";
import LoadingView from "../view/loading.js";
import EventPresenter, {State as EventPresenterViewState} from "./event.js";
import EventNewPresenter from "./event-new.js";
import {render, RenderPosition, removeElement} from "../utils/render.js";
import {sortTimeDown, sortPriceDown, transformToLocaleDate} from "../utils/common.js";
import {filter} from "../utils/filter.js";
import {SortType, UserAction, UpdateType} from "../const.js";

export default class Trip {
  constructor(tripEventsContainer, eventsModel, destinationsModel, offersModel, filterModel, api) {
    this._tripEventsContainer = tripEventsContainer;
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._api = api;
    this._currentSortType = SortType.EVENT;
    this._eventsPresenter = {};
    this._tripDaysList = [];
    this._isLoading = true;
    this._isDataAvailable = true;

    this._sortComponent = null;

    this._tripDaysComponent = new TripDaysView();
    this._noEventsComponent = new NoEventsView();
    this._loadingComponent = new LoadingView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._tripEventsContainer, this._handleViewAction, this._destinationsModel, this._offersModel);
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
    this._eventNewPresenter.init(this._tripDaysComponent, eventNewFormCloseHandler, this._getEvents(), this._noEventsComponent);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
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
        this._eventsPresenter[update.id].setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvent(update)
          .then((response) => this._eventsModel.updateEvent(updateType, response))
          .catch(() => {
            this._eventsPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addNewEvent(update)
          .then((response) => this._eventsModel.addNewEvent(updateType, response))
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventsPresenter[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => this._eventsModel.deleteEvent(updateType, update))
          .catch(() => {
            this._eventsPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, update) {
    switch (updateType) {
      case UpdateType.MAJOR:
        if (update && typeof update === `boolean`) {
          this._currentSortType = SortType.EVENT;
        }

        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.INIT:
        if (!this._destinationsModel.getDestinations() || !this._offersModel.getOffers()) {
          this._isDataAvailable = false;
        }
        this._isLoading = false;
        removeElement(this._loadingComponent);
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
    removeElement(this._loadingComponent);

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
    const eventPresenter = new EventPresenter(eventsList, this._handleViewAction, this._handleModeChange, this._destinationsModel, this._offersModel);
    eventPresenter.init(event);
    this._eventsPresenter[event.id] = eventPresenter;
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent, RenderPosition.BEFORE_END);
  }

  _renderNoEvents() {
    this._noEventsComponent = new NoEventsView(this._isDataAvailable);
    render(this._tripEventsContainer, this._noEventsComponent, RenderPosition.BEFORE_END);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getEvents().length || !this._isDataAvailable) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    this._renderTripDays();
  }
}
