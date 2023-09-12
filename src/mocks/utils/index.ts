import { ItemType } from "../interfaces";
import {
  calculateCpMinMaxAvailability,
  categorizeLotSize,
  combineCarparkData,
} from "./helpers";

export const retrieveCarparkCategoryData = (item: ItemType[]) => {
  const combinedCarparkData = combineCarparkData(item);

  const categories = categorizeLotSize(combinedCarparkData[0].carpark_data);

  const smallLotSizeInfo = calculateCpMinMaxAvailability(categories.small);
  const mediumLotSizeInfo = calculateCpMinMaxAvailability(categories.medium);
  const bigLotSizeInfo = calculateCpMinMaxAvailability(categories.big);
  const largeLotSizeInfo = calculateCpMinMaxAvailability(categories.large);

  return {
    small: smallLotSizeInfo,
    medium: mediumLotSizeInfo,
    big: bigLotSizeInfo,
    large: largeLotSizeInfo,
  };
};
