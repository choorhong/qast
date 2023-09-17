export type CarparkInfoType = {
  total_lots: string | number;
  lot_type?: string;
  lots_available: string | number;
};

export type CarparkDataType = {
  carpark_info: CarparkInfoType[];
  carpark_number: string;
  update_datetime: string;
};

export type ItemType = {
  timestamp: string;
  carpark_data: CarparkDataType[];
};

export type CategoriesType = {
  small: CarparkDataType[];
  medium: CarparkDataType[];
  big: CarparkDataType[];
  large: CarparkDataType[];
};

export type CategoriesKeyType = keyof CategoriesType;

export type CarparkMetricsType = {
  highestLotsAvailable: string | number;
  lowestLotsAvailable: string | number;
  highestLotsAvailableArray: Array<string | number>;
  lowestLotsAvailableArray: Array<string | number>;
};

export type ResultType = {
  timestamp: string;
  result: {
    timestamp: string;
    lotSizeInfo: Record<CategoriesKeyType, CarparkMetricsType>;
  }[];
};

export type CombinedAndCategorizedCarparkDataType = {
  timestamp: string;
  categorized_carpark_data: CategoriesType;
}[];
