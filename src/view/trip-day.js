import AbstractView from "./abstract.js";

const createTripDayItemTemplate = () => {
  return (
    `<li class="trip-days__item  day">
    </li>`
  );
};

export default class TripDay extends AbstractView {
  get template() {
    return createTripDayItemTemplate();
  }
}
