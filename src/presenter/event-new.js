import EventEditView from "../view/event-edit.js";
import {generateId} from "../mock/event.js";
import {render, RenderPosition, removeElement, replaceElement} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class EventNew {
  constructor(tripEventsContainer, handleEventChange, noEventsComponent, currentEvents, destinationsModel, offersModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._handleEventChange = handleEventChange;
    this._noEventsComponent = noEventsComponent;
    this._currentEvents = currentEvents;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._eventEditComponent = null;
    this._destroyCallback = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(tripDaysComponent, eventNewFormCloseHandler) {
    this._destroyCallback = eventNewFormCloseHandler;

    if (this._eventEditComponent !== null) {
      return;
    }

    this._tripDaysComponent = tripDaysComponent;
    this._eventEditComponent = new EventEditView(this._destinationsModel, this._offersModel);

    this._eventEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._eventEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    if (this._currentEvents.length) {
      render(this._tripEventsContainer, this._eventEditComponent, RenderPosition.BEFORE_ELEMENT, this._tripDaysComponent.element);
    } else {
      replaceElement(this._eventEditComponent, this._noEventsComponent);
    }

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    removeElement(this._eventEditComponent);
    this._eventEditComponent = null;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _formSubmitHandler(event) {
    this._handleEventChange(
        UserAction.ADD_EVENT,
        UpdateType.MAJOR,
        Object.assign({id: generateId()}, event)
    );
    this.destroy();
  }

  _deleteClickHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
