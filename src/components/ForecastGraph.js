import React from "react";

function ForecastGraph({ data }) {
  return (
    <div>
      <h2>Predictions for {data.reservoir} in {data.year}</h2>
      <img src={data.graph} alt="Forecast Graph" style={{ width: "100%" }} />
      <h3>Predictions</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Predicted Storage</th>
            <th>Lower Bound</th>
            <th>Upper Bound</th>
          </tr>
        </thead>
        <tbody>
          {data.predictions.map((row, index) => (
            <tr key={index}>
              <td>{new Date(row.ds).toLocaleDateString()}</td>
              <td>{row.yhat.toFixed(2)}</td>
              <td>{row.yhat_lower.toFixed(2)}</td>
              <td>{row.yhat_upper.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ForecastGraph;
