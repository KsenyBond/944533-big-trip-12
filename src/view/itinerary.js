const createTripDaysItemTemplate = (allEvents) => {
  const allEventsDates = allEvents.map((day) => day.startTime.toLocaleDateString(`en-GB`));
  const eventsUniqueDates = Array.from(new Set(allEventsDates));

  return eventsUniqueDates.map((date) =>
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${eventsUniqueDates.indexOf(date) + 1}</span>
        <time class="day__date" datetime="${date.split(`/`).reverse().join(`-`)}">
          ${(new Date(date.split(`/`).reverse().join(`-`))).toDateString().slice(4, 10)}
        </time>
      </div>
      <ul class="trip-events__list day${date.split(`/`).reverse().join(`-`)}">
      </ul>
    </li>`).join(``);
};

const createItineraryTemplate = (events = []) => {
  const [...allEvents] = events;

  const tripDaysItemTemplate = createTripDaysItemTemplate(allEvents);

  return (
    `<ul class="trip-days">
      ${tripDaysItemTemplate}
    </ul>`
  );
};

export {createItineraryTemplate};