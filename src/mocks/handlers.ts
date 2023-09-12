import { rest } from "msw";
import { retrieveCarparkCategoryData } from "./utils";

export const handlers = [
  rest.get("http://localhost:8080/carpark-search", async (_req, res, ctx) => {
    const dateString = new Date().toISOString();

    const regex = /(.*?)\w$/; // Matches any character before the last word character
    const dateISOString = dateString.replace(regex, "$1");

    const url = `https://api.data.gov.sg/v1/transport/carpark-availability?date_time=${encodeURIComponent(
      dateISOString
    )}`;

    const response = await fetch(url);
    const responseBody = await response.json();
    const result = retrieveCarparkCategoryData(responseBody.items);

    return res(
      ctx.status(200),
      ctx.json({ timestamp: dateString, result: result })
    );
  }),
];
