import moment from "moment";

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateValue = (range) => {
  const randomIndex = getRandomInteger(0, range.length - 1);

  return range[randomIndex];
};

const shuffle = (array) => {
  const [...arrayCopy] = array;

  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arrayCopy[i];
    arrayCopy[i] = arrayCopy[j];
    arrayCopy[j] = temp;
  }

  return arrayCopy;
};

const setNeutralTime = () => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return new Date(currentDate);
};

const transformToDateAndTime = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }

  return moment(date).format(`DD/MM/YY HH:mm`);
};

const transformToTime = (time) => {
  return moment(time).format(`HH:mm`);
};

const transformToDatetimeAttr = (date) => {
  return moment(date).format(`DD-MM-YY`);
};

const generateDurationDHM = (duration) => {
  const eventDuration = moment.duration(duration);

  let days = eventDuration.days() ? `${eventDuration.days()}D` : ``;
  let hours = eventDuration.hours() ? `${eventDuration.hours()}H` : ``;
  let minutes = eventDuration.minutes() ? `${eventDuration.minutes()}M` : ``;

  return [days, hours, minutes].map((number) => number ? number.padStart(3, `0`) : ``).join(` `).trim();
};

const transformToDatetime = (date) => {
  return date.split(`/`).reverse().join(`-`);
};

const transformToMonthDay = (datetime) => {
  return new Date(datetime).toDateString().slice(4, 10);
};

const transformToLocaleDate = (event) => {
  return event.startTime.toLocaleDateString(`en-GB`);
};

const sortTimeDown = (eventA, eventB) => {
  return eventB.duration - eventA.duration;
};

const sortPriceDown = (taskA, taskB) => {
  return taskB.price - taskA.price;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export {getRandomInteger, generateValue, shuffle, setNeutralTime, transformToDateAndTime, transformToDatetime,
  transformToTime, transformToDatetimeAttr, generateDurationDHM, transformToMonthDay, transformToLocaleDate,
  sortTimeDown, sortPriceDown, updateItem};
