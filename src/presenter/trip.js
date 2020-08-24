import SortView from "../view/sort.js";
import EventEditView from "../view/event-edit.js";
import ItineraryView from "../view/itinerary.js";
import EventView from "../view/event.js";
import NoEventsView from "../view/no-events";
import {render, RenderPosition, replaceElement} from "../utils/render";
import {checkDay} from "../utils/common";
import {EVENTS_NUMBER} from "../const.js";

export default class Trip {
  constructor(tripEventsContainer, tripEvents) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripDaysComponent = new ItineraryView(tripEvents);
    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();
  }

  init(tripEvents) {
    this.tripEvents = tripEvents.slice();

    this._renderTrip();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFORE_END);
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
      this._renderEvent(this._tripEventsContainer.querySelector(`.day${checkDay(this.tripEvents[i].startTime)}`), this.tripEvents[i]);
    }
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent, RenderPosition.BEFORE_END);
  }

  _renderTrip() {
    if (!this.tripEvents.length) {
      this._renderNoEvents();
    } else {

      this._renderSort();

      render(this._tripEventsContainer, this._tripDaysComponent, RenderPosition.BEFORE_END);
      this._renderEvents(EVENTS_NUMBER);
    }
  }
}
