import SortView from "../view/sort.js";
import EventEditView from "../view/event-edit.js";
import TripDaysView from "../view/trip-days.js";
import TripDayView from "../view/trip-day.js";
import TripDayCounterView from "../view/day-counter.js";
import TripEventsListView from "../view/trip-events-list.js";
import EventView from "../view/event.js";
import NoEventsView from "../view/no-events.js";
import {render, RenderPosition, replaceElement} from "../utils/render.js";
import {sortTimeDown, sortPriceDown, transformToLocaleDate} from "../utils/common.js";
import {SortTypes} from "../const.js";

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._currentSortType = SortTypes.EVENT;

    this._tripDaysComponent = new TripDaysView();
    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._initialEvents = this._events.slice();

    this._renderTrip();
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
    this._tripDaysComponent.element.innerHTML = ``;
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
    });
  }

  _renderDayCounter(uniqueDate, index) {
    this._dayCounterComponent = new TripDayCounterView(uniqueDate, index, this._currentSortType);
    render(this._tripDayComponent, this._dayCounterComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderEventsList(uniqueDate) {
    this._eventsList = new TripEventsListView();
    render(this._tripDayComponent, this._eventsList, RenderPosition.BEFORE_END);
    let uniqueDateEvents = this._events.filter((event) => transformToLocaleDate(event) === uniqueDate);
    if (this._currentSortType !== SortTypes.EVENT) {
      uniqueDateEvents = this._events;
    }
    uniqueDateEvents.forEach((uniqueDateEvent) => {
      this._renderEvent(this._eventsList, uniqueDateEvent);
    });
  }

  _renderEvent(tripDayElement, event) {
    const eventComponent = new EventView(event);
    const eventEditComponent = new EventEditView(event);

    const replaceEventToEditForm = () => {
      replaceElement(eventEditComponent, eventComponent);
    };

    const replaceEditFormToEvent = () => {
      replaceElement(eventComponent, eventEditComponent);
    };

    const EscKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceEditFormToEvent();
        document.removeEventListener(`keydown`, EscKeyDownHandler);
      }
    };

    eventComponent.setRollupClickHandler(() => {
      replaceEventToEditForm();
      document.addEventListener(`keydown`, EscKeyDownHandler);
    });

    eventEditComponent.setFormSubmitHandler(() => {
      replaceEditFormToEvent();
      document.removeEventListener(`keydown`, EscKeyDownHandler);
    });

    render(tripDayElement, eventComponent, RenderPosition.BEFORE_END);
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
