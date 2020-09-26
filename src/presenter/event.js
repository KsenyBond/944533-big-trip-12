import EventView from "../view/event.js";
import EventEditView from "../view/event-edit.js";
import {render, RenderPosition, replaceElement, removeElement} from "../utils/render.js";
import {isDatesEqual} from "../utils/common.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Event {
  constructor(eventsList, handleEventChange, handleModeChange, destinationsModel, offersModel) {
    this._eventsListContainer = eventsList;
    this._handleEventChange = handleEventChange;
    this._handleModeChange = handleModeChange;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EventEditView(this._destinationsModel, this._offersModel, this._event);

    this._eventComponent.setRollupClickHandler(this._rollupClickHandler);
    this._eventEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._eventEditComponent.setDeleteClickHandler(this._deleteClickHandler);
    this._eventEditComponent.setFavoriteChangeHandler(this._favoriteChangeHandler);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._eventsListContainer, this._eventComponent, RenderPosition.BEFORE_END);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replaceElement(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replaceElement(this._eventEditComponent, prevEventEditComponent);
    }

    removeElement(prevEventComponent);
    removeElement(prevEventEditComponent);
  }

  _replaceEventToEditForm() {
    replaceElement(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._handleModeChange();
    this._mode = Mode.EDITING;
  }

  _replaceEditFormToEvent() {
    replaceElement(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToEvent();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._eventEditComponent.reset(this._event);
      this._replaceEditFormToEvent();
    }
  }

  _rollupClickHandler() {
    this._replaceEventToEditForm();
  }

  _formSubmitHandler(event) {
    const isMinorUpdate = isDatesEqual(this._event.startTime, event.startTime)
      && isDatesEqual(this._event.endTime, event.endTime)
      && this._event.price === event.price;

    this._handleEventChange(
        UserAction.UPDATE_EVENT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.MAJOR,
        event
    );
    this._replaceEditFormToEvent();
  }

  _deleteClickHandler(event) {
    this._handleEventChange(
        UserAction.DELETE_EVENT,
        UpdateType.MAJOR,
        event
    );
  }

  _favoriteChangeHandler() {
    this._handleEventChange(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
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
