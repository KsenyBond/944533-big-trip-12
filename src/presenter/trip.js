import SortView from "../view/sort.js";
import EventEditView from "../view/event-edit.js";
import ItineraryView from "../view/itinerary.js";
import EventView from "../view/event.js";
import NoEventsView from "../view/no-events.js";
import {render, RenderPosition, replaceElement} from "../utils/render.js";
import {checkDay, sortTimeDown, sortPriceDown} from "../utils/common.js";
import {EVENTS_NUMBER, SortTypes} from "../const.js";

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._currentSortType = SortTypes.EVENT;

    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripEvents) {
    this._tripEvents = tripEvents.slice();
    this._initialTripEvents = tripEvents.slice();

    this._tripDaysComponent = new ItineraryView(this._tripEvents);

    this._renderTrip();
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortTypes.TIME:
        this._tripEvents.sort(sortTimeDown);
        break;
      case SortTypes.PRICE:
        this._tripEvents.sort(sortPriceDown);
        break;
      default:
        this._tripEvents = this._initialTripEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    if (sortType === SortTypes.EVENT) {
      this._sortComponent.element.querySelector(`.trip-sort__item--day`).textContent = `Day`;
      this._tripDaysComponent = new ItineraryView(this._initialTripEvents);
      this._tripEventsContainer.replaceChild(this._tripDaysComponent.element, this._tripEventsContainer.querySelector(`.trip-days`));
      this._renderEvents(EVENTS_NUMBER);
    } else {
      this._sortComponent.element.querySelector(`.trip-sort__item--day`).textContent = ``;
      this._sortTasks(sortType);
      this._tripDaysSortComponent = new ItineraryView(this._tripEvents);
      this._clearEvents();
      this._renderSortedEvents(EVENTS_NUMBER);
    }
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFORE_ELEMENT, this._tripEventsContainer.querySelector(`.trip-days`));
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearEvents() {
    this._tripEventsContainer.replaceChild(this._tripDaysSortComponent.element, this._tripEventsContainer.querySelector(`.trip-days`));
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

  _renderEvents(count) {
    for (let i = 0; i < count; i++) {
      this._renderEvent(this._tripDaysComponent.element.querySelector(`ul[data-datetime="${checkDay(this._tripEvents[i].startTime)}"]`), this._tripEvents[i]);
    }
  }

  _renderSortedEvents(count) {
    for (let i = 0; i < count; i++) {
      this._renderEvent(this._tripDaysSortComponent.element.querySelector(`.trip-events__list`), this._tripEvents[i]);
    }
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent, RenderPosition.BEFORE_END);
  }

  _renderTrip() {
    if (!this._tripEvents.length) {
      this._renderNoEvents();
    } else {
      render(this._tripEventsContainer, this._tripDaysComponent, RenderPosition.BEFORE_END);

      this._renderSort();
      this._renderEvents(EVENTS_NUMBER);
    }
  }
}
