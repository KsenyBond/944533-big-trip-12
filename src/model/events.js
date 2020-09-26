import Observer from "../utils/observer.js";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
  }

  get events() {
    return this._events.sort((event1, event2) => event1.startTime.getTime() - event2.startTime.getTime());
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update non-existent event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete non-existent task`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          startTime: event.date_from !== null ? new Date(event.date_from) : event.date_from,
          endTime: event.date_to !== null ? new Date(event.date_to) : event.date_to,
          price: event.base_price,
          isFavorite: event.is_favorite
        }
    );

    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.base_price;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign({}, event, {
      "date_from": event.startTime instanceof Date ? event.startTime.toISOString() : null,
      "date_to": event.endTime instanceof Date ? event.endTime.toISOString() : null,
      "base_price": event.price,
      "is_favorite": event.isFavorite
    });

    delete adaptedEvent.startTime;
    delete adaptedEvent.endTime;
    delete adaptedEvent.price;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
