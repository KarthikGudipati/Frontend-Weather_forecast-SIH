import React, { useState } from "react";
import ForecastGraph from "./ForecastGraph";

function ForecastForm() {
  const [year, setYear] = useState("");
  const [reservoir, setReservoir] = useState("");
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setForecastData(null);

    try {
      const response = await fetch("http://localhost:4000/api/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year, reservoir }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      setForecastData(data);
    } catch (err) {
      setError("Unable to connect to the server");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Reservoir:
          <input
            type="text"
            value={reservoir}
            onChange={(e) => setReservoir(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Get Forecast</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {forecastData && <ForecastGraph data={forecastData} />}
    </div>
  );
}

export default ForecastForm;
