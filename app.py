from flask import Flask, request, jsonify
import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)

# Load the dataset
file_path = 'reservoir_karnataka.xlsx'
data = pd.read_excel(file_path, sheet_name='Sheet1')

# Ensure Date column is in datetime format
data['Date'] = pd.to_datetime(data['Date'], format='%Y-%m')

# Prepare data
forecast_data = data[['Date', 'Current Live Storage', 'District', 'Reservoir Name']].rename(
    columns={'Date': 'ds', 'Current Live Storage': 'y'}
)
forecast_data = forecast_data.dropna()

@app.route('/forecast', methods=['POST'])
def forecast():
    request_data = request.get_json()
    year = request_data.get('year')
    reservoir_name = request_data.get('reservoir')

    if not year or not reservoir_name:
        return jsonify({'error': 'Year and Reservoir Name are required'}), 400

    # Filter data for the selected reservoir
    reservoir_data = forecast_data[forecast_data['Reservoir Name'] == reservoir_name]

    if reservoir_data.empty:
        return jsonify({'error': 'No data found for the selected reservoir'}), 404

    # Fit the Prophet model
    model = Prophet()
    model.fit(reservoir_data[['ds', 'y']])

    # Predict future storage
    future = model.make_future_dataframe(periods=120, freq='M')
    forecast = model.predict(future)

    # Filter predictions for the selected year
    forecast['year'] = forecast['ds'].dt.year
    year_forecast = forecast[forecast['year'] == int(year)]

    if year_forecast.empty:
        return jsonify({'error': f'No predictions available for year {year}'}), 404

    # Generate plot
    plt.figure(figsize=(12, 6))
    plt.plot(reservoir_data['ds'], reservoir_data['y'], label='Actual Live Storage', color='blue')
    plt.plot(forecast['ds'], forecast['yhat'], label='Predicted Live Storage', color='orange', linestyle='--')
    plt.fill_between(
        forecast['ds'], forecast['yhat_lower'], forecast['yhat_upper'], color='orange', alpha=0.2, label='Confidence Interval'
    )
    plt.title(f'Actual vs Predicted Live Storage for {reservoir_name} ({year})')
    plt.xlabel('Date')
    plt.ylabel('Live Storage (in million cubic meters)')
    plt.legend()
    plt.grid()

    # Convert plot to base64
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    graph_url = base64.b64encode(img.getvalue()).decode()
    plt.close()

    return jsonify({
        'year': year,
        'reservoir': reservoir_name,
        'graph': f'data:image/png;base64,{graph_url}',
        'predictions': year_forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_dict(orient='records')
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
