import { ItemType } from "../interfaces";
import {
  categorizeCarparkLotSize,
  combineCarparkData,
  retrieveCpMinMaxAvailability,
  calculateCarparkMinMaxAvailability,
  combineAndCategorizeCarparkData,
} from "./helpers";

/**
 * Deprecated!. This handler no longer integrates with FE.
 * @param items
 * @returns
 */
export const getCpCategoryDataV1 = async (items: ItemType[]) => {
  // Combine the total lots of a carpark
  const combinedCarparkData = combineCarparkData(items);
  // Categorize the carpark based on their total lots
  const categories = categorizeCarparkLotSize(
    combinedCarparkData[0].carpark_data
  );
  // Retrieve the highest and lowest lots availability of a category
  const lotSizeInfo = retrieveCpMinMaxAvailability(categories);
  return lotSizeInfo;
};

/**
 * Old handler. Please use [getCpCategoryDataV3] for an logically optimized handler.
 * @param items
 * @returns
 */
export const getCpCategoryDataV2 = async (items: ItemType[]) => {
  // Combine the total lots of a carpark
  const combinedCarparkData = combineCarparkData(items);

  // Categorize the carpark based on their total lots
  const categorizeCpLotSize = (items: typeof combinedCarparkData) => {
    return items.map((item) => {
      const categorizedCarparkLotSize = categorizeCarparkLotSize(
        item.carpark_data
      );
      return {
        timestamp: item.timestamp,
        categorized_carpark_data: categorizedCarparkLotSize,
      };
    });
  };
  const categorizedCpLotSize = categorizeCpLotSize(combinedCarparkData);

  // Calculate and retrieve the highest and lowest lots availability of a category
  const result = calculateCarparkMinMaxAvailability(categorizedCpLotSize);
  return result;
};

const getCpCategoryDataV3 = async (items: ItemType[]) => {
  //  Combine and categorize the carpark based on their total lots
  const combinedAndCategorizedCarparkData =
    combineAndCategorizeCarparkData(items);

  //  Calculate and retrieve the highest and lowest lots availability of a category
  const result = calculateCarparkMinMaxAvailability(
    combinedAndCategorizedCarparkData
  );
  return result;
};

export const retrieveCarparkCategoryData = async (items: ItemType[]) => {
  // // ----- OLD HANDLER 1 : -----
  // const result = getCpCategoryDataV1(items);

  // // ----- OLD HANDLER 2: -----
  // const result = getCpCategoryDataV2(items);

  // // ----- LATEST HANDLER 3: -----
  const result = getCpCategoryDataV3(items);

  return result;
};
