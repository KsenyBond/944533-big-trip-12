import SortView from "../view/sort.js";
import TripDaysView from "../view/trip-days.js";
import TripDayView from "../view/trip-day.js";
import TripDayCounterView from "../view/day-counter.js";
import TripEventsListView from "../view/trip-events-list.js";
import NoEventsView from "../view/no-events.js";
import EventPresenter from "./event.js";
import {render, RenderPosition, removeElement} from "../utils/render.js";
import {sortTimeDown, sortPriceDown, transformToLocaleDate, updateItem} from "../utils/common.js";
import {SortTypes} from "../const.js";


export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._currentSortType = SortTypes.EVENT;
    this._eventsPresenter = {};
    this._tripDaysList = [];

    this._tripDaysComponent = new TripDaysView();
    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._initialEvents = this._events.slice();

    this._renderTrip();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._initialEvents = updateItem(this._initialEvents, updatedEvent);
    this._eventsPresenter[updatedEvent.id].init(updatedEvent);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFORE_END);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearTripDays();
    this._renderTripDays();
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortTypes.TIME:
        this._events.sort(sortTimeDown);
        break;
      case SortTypes.PRICE:
        this._events.sort(sortPriceDown);
        break;
      default:
        this._events = this._initialEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _clearTripDays() {
    this._tripDaysList.forEach((tripDay) => removeElement(tripDay));
    // Object
    //   .values(this._eventsPresenter)
    //   .forEach((presenter) => presenter.destroy());
    // this._eventsPresenter = {};
  }

  _renderTripDays() {
    render(this._tripEventsContainer, this._tripDaysComponent, RenderPosition.BEFORE_END);
    this._renderTripDay();
  }

  _renderTripDay() {
    const [...tripEvents] = this._events;
    const eventsDates = tripEvents.map((event) => transformToLocaleDate(event));
    let eventsUniqueDates = Array.from(new Set(eventsDates));
    if (this._currentSortType !== SortTypes.EVENT) {
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
    let uniqueDateEvents = this._events.filter((event) => transformToLocaleDate(event) === uniqueDate);
    if (this._currentSortType !== SortTypes.EVENT) {
      uniqueDateEvents = this._events;
    }
    uniqueDateEvents.forEach((uniqueDateEvent) => {
      this._renderEvent(this._eventsListComponent, uniqueDateEvent);
    });
  }

  _renderEvent(eventsList, event) {
    const eventPresenter = new EventPresenter(eventsList, this._handleEventChange);
    eventPresenter.init(event);
    this._eventsPresenter[event.id] = eventPresenter;
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent, RenderPosition.BEFORE_END);
  }

  _renderTrip() {
    if (!this._events.length) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    this._renderTripDays();
  }
}
