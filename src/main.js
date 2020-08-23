import TripMainInfoView from "./view/trip-main-info.js";
import TripTabsView from "./view/trip-tabs.js";
import TripFiltersView from "./view/trip-filters.js";
import SortView from "./view/sort.js";
import EventEditView from "./view/event-edit.js";
import ItineraryView from "./view/itinerary.js";
import EventView from "./view/event.js";
import NoEventsView from "./view/no-events";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils.js";

const EVENTS_NUMBER = 16;

const events = new Array(EVENTS_NUMBER)
  .fill()
  .map(generateEvent)
  .sort((event1, event2) => event1.startTime.getTime() - event2.startTime.getTime());

const siteHeaderMainElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = document.querySelector(`.trip-main__trip-controls`);
const siteHeaderControlsHiddenElement = siteHeaderMainElement.querySelector(`.trip-controls .visually-hidden:last-child`);
const siteMainElement = document.querySelector(`.trip-events`);

const renderEvent = (tripDayElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const replaceEventToEditForm = () => {
    tripDayElement.replaceChild(eventEditComponent.element, eventComponent.element);
  };

  const replaceEditFormToEvent = () => {
    tripDayElement.replaceChild(eventComponent.element, eventEditComponent.element);
  };

  const EscKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditFormToEvent();
      document.removeEventListener(`keydown`, EscKeyDownHandler);
    }
  };

  eventComponent.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToEditForm();
    document.addEventListener(`keydown`, EscKeyDownHandler);
  });

  eventEditComponent.element.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditFormToEvent();
    document.removeEventListener(`keydown`, EscKeyDownHandler);
  });

  render(tripDayElement, eventComponent.element, RenderPosition.BEFORE_END);
};

render(siteHeaderMainElement, new TripMainInfoView(events).element, RenderPosition.AFTER_BEGIN);
render(siteHeaderControlsElement, new TripTabsView().element, RenderPosition.BEFORE_ELEMENT, siteHeaderControlsHiddenElement);
render(siteHeaderControlsElement, new TripFiltersView().element, RenderPosition.BEFORE_END);
render(siteMainElement, new SortView().element, RenderPosition.BEFORE_END);
render(siteMainElement, new ItineraryView(events).element, RenderPosition.BEFORE_END);

if (!events.length) {
  render(siteMainElement, new NoEventsView().element, RenderPosition.BEFORE_END);
} else {
  const checkDay = (time) => {
    return time.toLocaleDateString(`en-GB`).split(`/`).reverse().join(`-`);
  };

  const renderEvents = (count) => {
    for (let i = 0; i < count; i++) {
      renderEvent(siteMainElement.querySelector(`.day${checkDay(events[i].startTime)}`), events[i]);
    }
  };

  renderEvents(EVENTS_NUMBER);
}
