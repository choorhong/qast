import {
  CarparkInfoType,
  ItemType,
  CarparkDataType,
  CategoriesType,
  CarparkMetricsType,
  CategoriesKeyType,
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
 * Show carpark data after combining multiple lots of a car park (if any).
 * @param items
 * @returns
 */
export const combineCarparkData = (items: ItemType[]) => {
  const combinedData = items.map((item) => {
    const carparkData = item.carpark_data.map(
      (carparkItem: CarparkDataType) => {
        const combinedCarparkInfo = combineCarparkInfo(
          carparkItem.carpark_info
        );

        return {
          carpark_info: combinedCarparkInfo,
          carpark_number: carparkItem.carpark_number,
          update_datetime: carparkItem.update_datetime,
        };
      }
    );

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
// - large : 400 lots or more ( >= 100 )

/**
 * Categorize carparks based on their respective total lots
 * @param data
 */
export const categorizeLotSize = (data: CarparkDataType[]) => {
  // Initialize categories
  const categories: CategoriesType = {
    small: [],
    medium: [],
    big: [],
    large: [],
  };

  data.forEach((item) => {
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

export const retrieveCpMinMaxAvailability = (data: CategoriesType) => {
  const result = {} as Record<CategoriesKeyType, CarparkMetricsType>;

  Object.entries(data).forEach((element) => {
    const carparkData = element[1];
    const metrics = calculateCpMinMaxAvailability(carparkData);
    result[element[0] as CategoriesKeyType] = metrics;
  });

  return result;
};
