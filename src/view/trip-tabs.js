import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createTripTabsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" data-tab=${MenuItem.TABLE} href="#">${MenuItem.TABLE}</a>
      <a class="trip-tabs__btn" data-tab=${MenuItem.STATS} href="#">${MenuItem.STATS}</a>
    </nav>`
  );
};

export default class TripTabs extends AbstractView {
  constructor() {
    super();

    this._siteMenuTabsClickHandler = this._siteMenuTabsClickHandler.bind(this);
  }

  get template() {
    return createTripTabsTemplate();
  }

  _siteMenuTabsClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuTabsClick(evt.target.textContent);
  }

  setMenuTabsClickHandler(callback) {
    this._callback.menuTabsClick = callback;
    this.element.addEventListener(`click`, this._siteMenuTabsClickHandler);
  }

  setMenuItem(menuItemUpdate, menuItem) {
    const tabUpdate = this.element.querySelector(`[data-tab=${menuItemUpdate}]`);
    const tab = this.element.querySelector(`[data-tab=${menuItem}]`);

    if (tabUpdate !== null) {
      tabUpdate.classList.add(`trip-tabs__btn--active`);
    }

    if (tab !== null) {
      tab.classList.remove(`trip-tabs__btn--active`);
    }
  }
}
