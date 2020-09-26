import {getRandomInteger} from "../utils/common.js";
import {DESTINATION_DESCRIPTION} from "../const.js";
import {DESTINATION_PHOTOS, EVENT_DESTINATIONS} from "../const";

const destinations = new Map();

const generateRandomDescription = () => {
  const getRandomDescription = () => {
    return DESTINATION_DESCRIPTION[getRandomInteger(0, DESTINATION_DESCRIPTION.length - 1)];
  };
  const destinationDescription =
    new Array(getRandomInteger(1, 5))
      .fill()
      .map(getRandomDescription);
  const uniqueDestinationDescription = new Set(destinationDescription);

  return Array.from(uniqueDestinationDescription).join(` `);
};

const generateRandomPictures = () => {
  return {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
    description: ``
  };
};

EVENT_DESTINATIONS.forEach((name) => {
  const description = generateRandomDescription();
  const pictures = new Array(DESTINATION_PHOTOS).fill().map(generateRandomPictures);

  destinations.set(name, {name, description, pictures});
});

export {destinations};
