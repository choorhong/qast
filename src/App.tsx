import { useEffect, useState } from "react";
import { ResultType } from "./mocks/interfaces";
import "./App.css";

const fetchCarParkData = async () => {
  const result = await fetch("http://localhost:8080/carpark-search");
  return await result.json();
};

const min = 1000 * 60;

function App() {
  const [response, setResponse] = useState<ResultType | undefined>();

  useEffect(() => {
    // Get initial data at time = 0
    (async () => {
      const res = await fetchCarParkData();
      setResponse(res);
    })();

    // Get subsequent data every 1 min after.
    const timeInterval = setInterval(async () => {
      const res = await fetchCarParkData();
      setResponse(res);
    }, min);

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div className="container">
      {response ? (
        <>
          <p>Date/Time: {new Date(response.timestamp).toLocaleString()}</p>
          {Object.entries(response.result).map(([key, value]) => (
            <fieldset>
              <legend>{key.toUpperCase()}</legend>
              <div className="info-container">
                <div className="info">
                  <p className="label">
                    HIGHEST ({value.highestLotsAvailable} lots available)
                  </p>
                  <p className="value">
                    {value.highestLotsAvailableArray.join(", ")}
                  </p>
                </div>

                <div className="info">
                  <p className="label">
                    LOWEST ({value.lowestLotsAvailable} lots available)
                  </p>
                  <p className="value">
                    {value.lowestLotsAvailableArray.join(", ")}
                  </p>
                </div>
              </div>
            </fieldset>
          ))}
        </>
      ) : (
        <h1>Loading.....</h1>
      )}
    </div>
  );
}

export default App;
