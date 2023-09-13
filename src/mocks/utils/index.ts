import { ItemType } from "../interfaces";
import {
  categorizeLotSize,
  combineCarparkData,
  retrieveCpMinMaxAvailability,
} from "./helpers";

export const retrieveCarparkCategoryData = (item: ItemType[]) => {
  // Combine the total lots of a carpark
  const combinedCarparkData = combineCarparkData(item);

  // Categorize the carpark based on their total lots
  const categories = categorizeLotSize(combinedCarparkData[0].carpark_data);

  // Retrieve the highest and lowest lots availability of a category
  const lotSizeInfo = retrieveCpMinMaxAvailability(categories);

  return lotSizeInfo;
};
