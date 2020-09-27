import moment from "moment";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

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

const transformToDatetime = (date) => {
  return date.split(`/`).reverse().join(`-`);
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

const formatTypeName = (typeToFormat) => {
  return typeToFormat[0].toUpperCase() + typeToFormat.slice(1);
};

export {generateId, setNeutralTime, transformToDateAndTime, transformToTime, transformToDatetime,
  transformToDatetimeAttr, generateDurationDHM, transformToMonthDay, transformToLocaleDate,
  sortTimeDown, sortPriceDown, isDatesEqual, isEventPast, isEventFuture, formatTypeName};
