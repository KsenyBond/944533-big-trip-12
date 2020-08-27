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

const checkDay = (time) => {
  return time.toLocaleDateString(`en-GB`).split(`/`).reverse().join(`-`);
};

const sortTimeDown = (eventA, eventB) => {
  return eventB.duration - eventA.duration;
};

const sortPriceDown = (taskA, taskB) => {
  return taskB.price - taskA.price;
};

const isTimeSorted = (events) => {
  return events.slice(1).every((event, index) => events[index].duration >= event.duration);
};

const isPriceSorted = (events) => {
  return events.slice(1).every((event, index) => events[index].price >= event.price);
};

export {getRandomInteger, generateValue, shuffle, setNeutralTime, checkDay, sortTimeDown, sortPriceDown, isTimeSorted, isPriceSorted};
