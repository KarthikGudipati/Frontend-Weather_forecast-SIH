import React from "react";
import ForecastForm from "./components/ForecastForm";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>
        Reservoir Live Storage Forecast
      </h1>
      <p style={{ textAlign: "center", color: "#555" }}>
        Enter the year and reservoir name to get live storage predictions.
      </p>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <ForecastForm />
      </div>
    </div>
  );
}

export default App;
