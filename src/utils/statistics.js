import moment from "moment";
import {TRANSFER_TYPES} from "../const.js";

const divideCostsByTypes = (events) => {
  return [...new Set(events.map((event) => event.type))]
    .map((type) => {
      const eventsByType = events.filter((event) => event.type === type);
      const sum = eventsByType.reduce((acc, val) => ({price: acc.price + val.price}));
      return [type, sum.price];
    })
    .sort(([, priceA], [, priceB]) => priceB - priceA);
};

const divideByTransportTypes = (events) => {
  const [...transferTypes] = TRANSFER_TYPES;

  return transferTypes
    .map((type) => {
      return [type, events.filter((event) => event.type === type).length];
    })
    .sort(([, countA], [, countB]) => countB - countA);
};

const divideDurationsByTypes = (events) => {
  return [...new Set(events.map((event) => event.type))]
    .map((type) => {
      const eventsByType = events.filter((event) => event.type === type);
      const sum = eventsByType.reduce((acc, val) => (moment(acc) + moment(val.startTime).diff(val.endTime)), 0);
      return [type, Math.ceil(moment.duration(sum).asHours()).toString().replace(`-`, ``)];
    })
    .sort(([, durationA], [, durationB]) => durationB - durationA);
};

export {divideCostsByTypes, divideByTransportTypes, divideDurationsByTypes};
