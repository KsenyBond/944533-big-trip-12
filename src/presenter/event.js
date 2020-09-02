import EventView from "../view/event.js";
import EventEditView from "../view/event-edit.js";
import {render, RenderPosition, replaceElement, removeElement} from "../utils/render.js";

export default class Event {
  constructor(eventsList, handleEventChange) {
    this._eventsListContainer = eventsList;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._handleEventChange = handleEventChange;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EventEditView(this._event);

    this._eventComponent.setRollupClickHandler(this._rollupClickHandler);
    this._eventEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._eventEditComponent.setFavoriteChangeHandler(this._favoriteChangeHandler);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._eventsListContainer, this._eventComponent, RenderPosition.BEFORE_END);
      return;
    }

    if (this._eventsListContainer.element.contains(prevEventComponent.element)) {
      replaceElement(this._eventComponent, prevEventComponent);
    }

    if (this._eventsListContainer.element.contains(prevEventEditComponent.element)) {
      replaceElement(this._eventEditComponent, prevEventEditComponent);
    }

    removeElement(prevEventComponent);
    removeElement(prevEventEditComponent);
  }

  _replaceEventToEditForm() {
    replaceElement(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceEditFormToEvent() {
    replaceElement(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditFormToEvent();
    }
  }

  _rollupClickHandler() {
    this._replaceEventToEditForm();
  }

  _formSubmitHandler(event) {
    this._handleEventChange(event);
    this._replaceEditFormToEvent();
  }

  _favoriteChangeHandler() {
    this._handleEventChange(
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  destroy() {
    removeElement(this._eventComponent);
    removeElement(this._eventEditComponent);
  }
}
