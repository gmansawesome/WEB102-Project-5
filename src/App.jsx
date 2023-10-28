import './App.css';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState('temp');
  const [minutelyData, setMinutelyData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.weatherbit.io/v2.0/current?lat=32.7157&lon=-117.1611&key=957b7e5ff9b841779541cb35813a6f2d&include=minutely'
        );
        const data = await response.json();
        setWeatherData(data.data);
        setMinutelyData(data.minutely);
        setFilteredData(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);  

  useEffect(() => {
    const filterData = () => {
      const filtered = weatherData.filter((item) => {
        // Check if the selected data type matches
        const dataTypeMatch = selectedDataType === 'all' || item[selectedDataType];
        return dataTypeMatch;
      });
      setFilteredData(filtered);
    };

    filterData();
  }, [selectedDataType, weatherData]);

  const renderSelectedData = (item) => {
    switch (selectedDataType) {
      case 'temp':
        return `Temperature: ${item.temp}°C`;
      case 'description':
        return `Weather Description: ${item.weather.description}`;
      case 'rh':
        return `Relative Humidity: ${item.rh}%`;
      case 'vis':
        return `Visibility: ${item.vis} km`;
      case 'wind_spd':
        return `Wind Speed: ${item.wind_spd} m/s`;
      case 'all':
        return `All Data: ${JSON.stringify(item)}`;
      default:
        return `Temperature: ${item.temp}°C`;
    }
  };

  const prepareChartData = () => {
    return minutelyData.map((item) => ({
      timestamp_local: item.timestamp_local,
      precipitation: item.precip,
      snow: item.snow,
      temperature: item.temp,
    }));
  };  

  return (
    <div>
      <h1>Totally Awesome Weather App</h1>
      <div>
        <select
          value={selectedDataType}
          onChange={(e) => setSelectedDataType(e.target.value)}
        >
          <option value="all">All Data</option>
          <option value="temp">Temperature</option>
          <option value="description">Weather Description</option>
          <option value="rh">Relative Humidity</option>
          <option value="vis">Visibility</option>
          <option value="wind_spd">Wind Speed</option>
        </select>
      </div>
      <ul>
        {filteredData.map((item) => (
          <div key={item.city_name}>
            <h2>{item.city_name}</h2>
            <p>{renderSelectedData(item)}</p>
          </div>
        ))}
      </ul>
      <hr></hr>
      <div>
        <h2>Graph:</h2>
        <LineChart width={600} height={300} data={prepareChartData()}>
          <CartesianGrid strokeDasharray="10 10" />
          <XAxis dataKey="timestamp_local" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="precipitation" stroke="blue" name="Precipitation" />
          <Line type="monotone" dataKey="snow" stroke="purple" name="Snow" />
          <Line type="monotone" dataKey="temperature" stroke="red" name="Temperature" />
        </LineChart>
      </div>
    </div>
  );
}

export default App;
