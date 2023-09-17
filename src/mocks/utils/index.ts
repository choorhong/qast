import { ItemType } from "../interfaces";
import {
  // categorizeCarparkLotSize,
  // combineCarparkData,
  // retrieveCpMinMaxAvailability,
  calculateCarparkMinMaxAvailability,
  combineAndCategorizeCarparkData,
} from "./helpers";

export const retrieveCarparkCategoryData = (items: ItemType[]) => {
  // // ----- OLD HANDLER 1 : -----
  // // ----- NO LONGER WORKS WITH FRONTEND -----

  // // Combine the total lots of a carpark
  // const combinedCarparkData = combineCarparkData(items);

  // // Categorize the carpark based on their total lots
  // const categories = categorizeCarparkLotSize(
  //   combinedCarparkData[0].carpark_data
  // );

  // // Retrieve the highest and lowest lots availability of a category
  // const lotSizeInfo = retrieveCpMinMaxAvailability(categories);
  // return lotSizeInfo;

  // // ----- OLD HANDLER 1 : -----
  // // ----- NO LONGER WORKS WITH FRONTEND -----

  // // ----- OLD HANDLER 2: -----
  // // ----- WORKS WITH FRONTEND -----

  // // Combine the total lots of a carpark
  // const combinedCarparkData = combineCarparkData(items);

  // const categorizeCpLotSize = (items: typeof combinedCarparkData) => {
  //   return items.map((item) => {
  //     const categorizedCarparkLotSize = categorizeCarparkLotSize(
  //       item.carpark_data
  //     );

  //     return {
  //       timestamp: item.timestamp,
  //       categorized_carpark_data: categorizedCarparkLotSize,
  //     };
  //   });
  // };

  // // Categorize the carpark based on their total lots
  // const categorizedCpLotSize = categorizeCpLotSize(combinedCarparkData);

  // // Calculate and retrieve the highest and lowest lots availability of a category
  // const result = calculateCarparkMinMaxAvailability(categorizedCpLotSize);

  // // ----- OLD HANDLER 2: -----
  // // ----- WORKS WITH FRONTEND -----

  // // ----- LATEST HANDLER 3: -----
  // // ----- WORKS WITH FRONTEND -----

  // // Combine and categorize the carpark based on their total lots
  const combinedAndCategorizedCarparkData =
    combineAndCategorizeCarparkData(items);

  // // Calculate and retrieve the highest and lowest lots availability of a category
  const result = calculateCarparkMinMaxAvailability(
    combinedAndCategorizedCarparkData
  );

  // // ----- LATEST HANDLER 3: -----
  // // ----- WORKS WITH FRONTEND -----

  return result;
};
