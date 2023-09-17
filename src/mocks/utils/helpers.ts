import {
  CarparkInfoType,
  ItemType,
  CarparkDataType,
  CategoriesType,
  CarparkMetricsType,
  CategoriesKeyType,
  CombinedAndCategorizedCarparkDataType,
} from "../interfaces";

/**
 * Each car park may have different lots.
 * Combine and calculate the total number of lots & available lots of a carpark
 * @param carparkInfo
 * @returns
 */
export const combineCarparkInfo = (carparkInfo: CarparkInfoType[]) => {
  const combinedInfo = carparkInfo.reduce(
    (acc, info) => {
      acc.totalLots += +info.total_lots;
      acc.lotsAvailable += +info.lots_available;
      return acc;
    },
    { totalLots: 0, lotsAvailable: 0 }
  );

  return [
    {
      total_lots: combinedInfo.totalLots,
      lots_available: combinedInfo.lotsAvailable,
    },
  ];
};

/**
 * Generate a centralized carpark info of a carpark numbr (carpark_number)
 * @param item
 * @returns
 */

const generateCarparkData = (item: ItemType) => {
  return item.carpark_data.map((carparkItem: CarparkDataType) => {
    const combinedCarparkInfo = combineCarparkInfo(carparkItem.carpark_info);

    const info = {
      carpark_info: combinedCarparkInfo,
      carpark_number: carparkItem.carpark_number,
      update_datetime: carparkItem.update_datetime,
    };

    return info;
  });
};

/**
 * Show carpark data after combining multiple lots of a car park (if any).
 * @param items
 * @returns
 */
export const combineCarparkData = (items: ItemType[]) => {
  const combinedData = items.map((item) => {
    const carparkData: CarparkDataType[] = generateCarparkData(item);

    return {
      timestamp: item.timestamp,
      carpark_data: carparkData,
    };
  });

  return combinedData;
};

// - small : less than 100 lots ( < 100 )
// - medium : 100 lots or more, but less than 300 lots ( >= 100 && < 300 )
// - big : 300 lots or more, but less than 400 lots ( >= 300 && < 400 )
// - large : 400 lots or more ( >= 400 )

const initializeCategories = (): CategoriesType => {
  return {
    small: [],
    medium: [],
    big: [],
    large: [],
  };
};

const categorizeLotSize = (
  item: CarparkDataType,
  categories: CategoriesType
) => {
  const totalLots = +item.carpark_info[0].total_lots;

  if (totalLots < 100) {
    categories.small.push(item);
  } else if (totalLots >= 100 && totalLots < 300) {
    categories.medium.push(item);
  } else if (totalLots >= 300 && totalLots < 400) {
    categories.big.push(item);
  } else {
    categories.large.push(item);
  }
};

/**
 * Categorize carparks based on their respective total lots
 * @param data
 */
export const categorizeCarparkLotSize = (data: CarparkDataType[]) => {
  // Initialize categories
  const categories = initializeCategories();

  data.forEach((item) => {
    categorizeLotSize(item, categories);
  });

  return categories;
};

/**
 * Calculate and show the relevant data of a carpark category
 * @param data
 * @returns
 */
export const calculateCpMinMaxAvailability = (
  data: CarparkDataType[]
): CarparkMetricsType => {
  let highestLotsAvailable = 0;
  let lowestLotsAvailable = Infinity;
  const highestLotsAvailableArray: string[] = [];
  const lowestLotsAvailableArray: string[] = [];

  data.forEach((item) => {
    const lotsAvailable = +item.carpark_info[0].lots_available;

    if (lotsAvailable > highestLotsAvailable) {
      highestLotsAvailable = lotsAvailable;
      highestLotsAvailableArray.length = 0;
      highestLotsAvailableArray.push(item.carpark_number);
    } else if (lotsAvailable === highestLotsAvailable) {
      highestLotsAvailableArray.push(item.carpark_number);
    }

    if (lotsAvailable < lowestLotsAvailable) {
      lowestLotsAvailable = lotsAvailable;
      lowestLotsAvailableArray.length = 0;
      lowestLotsAvailableArray.push(item.carpark_number);
    } else if (lotsAvailable === lowestLotsAvailable) {
      lowestLotsAvailableArray.push(item.carpark_number);
    }
  });

  return {
    highestLotsAvailable,
    lowestLotsAvailable,
    highestLotsAvailableArray,
    lowestLotsAvailableArray,
  };
};

/**
 * Show the calculated data of all carpark categories
 * @param data
 * @returns
 */
export const retrieveCpMinMaxAvailability = (data: CategoriesType) => {
  const result = {} as Record<CategoriesKeyType, CarparkMetricsType>;

  Object.entries(data).forEach((element) => {
    const carparkData = element[1];
    const metrics = calculateCpMinMaxAvailability(carparkData);
    result[element[0] as CategoriesKeyType] = metrics;
  });

  return result;
};

/**
 * Each car park may have different lots
 * 1. Combine and calculate the total number of lots & available lots of a carpark
 * 2. Categorize carparks based on their respective total lots
 * @param items
 * @returns
 */
export const combineAndCategorizeCarparkData = (items: ItemType[]) => {
  return items.map((item) => {
    const cpData: CarparkDataType[] = generateCarparkData(item);
    const categorizedCarparkLotSize = categorizeCarparkLotSize(cpData);

    return {
      timestamp: item.timestamp,
      categorized_carpark_data: categorizedCarparkLotSize,
    };
  });
};

/**
 * Calculate and show the relevant data of a carpark category
 * @param data
 * @returns
 */
export const calculateCarparkMinMaxAvailability = (
  items: CombinedAndCategorizedCarparkDataType
) => {
  return items.map((item) => {
    const lotSizeInfo = retrieveCpMinMaxAvailability(
      item.categorized_carpark_data
    );

    return {
      timestamp: item.timestamp,
      lotSizeInfo,
    };
  });
};
