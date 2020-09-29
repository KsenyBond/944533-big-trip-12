import moment from "moment";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateValue = (range) => {
  const randomIndex = getRandomInteger(0, range.length - 1);

  return range[randomIndex];
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

  const days = eventDuration.days() ? `${eventDuration.days()}D` : ``;
  const hours = eventDuration.hours() ? `${eventDuration.hours()}H` : ``;
  const minutes = eventDuration.minutes() ? `${eventDuration.minutes()}M` : ``;

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
  const getDuration = (event) => {
    return event.endTime - event.startTime;
  };

  return getDuration(eventB) - getDuration(eventA);
};

const sortPriceDown = (taskA, taskB) => {
  return taskB.price - taskA.price;
};

const isDatesEqual = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
};

const isEventPast = (endTime) => {
  const currentDate = new Date();

  return endTime.getTime() < currentDate.getTime();
};

const isEventFuture = (startTime) => {
  const currentDate = new Date();

  return startTime.getTime() > currentDate.getTime();
};

export {getRandomInteger, generateValue, setNeutralTime, transformToDateAndTime, transformToDatetime,
  transformToTime, transformToDatetimeAttr, generateDurationDHM, transformToMonthDay, transformToLocaleDate,
  sortTimeDown, sortPriceDown, isDatesEqual, isEventPast, isEventFuture, generateId};
