import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.weatherbit.io/v2.0/current?lat=32.7157&lon=-117.1611&key=957b7e5ff9b841779541cb35813a6f2d&include=minutely'
        );
        const data = await response.json();
        setWeatherData(data.data);
        setFilteredData(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filterData = () => {
    const filtered = weatherData.filter(item => {
      return item.city_name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredData(filtered);
  };

  // const calculateStatistics = () => {
  //   const totalItems = filteredData.length;
  // };

  // useEffect(() => {
  //   filterData();
  //   calculateStatistics();
  // }, [searchTerm, weatherData]);

  return (
    <div>
      <h1>totally awesome weather app</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* <div>
        <h2>Summary Statistics</h2>
        <p>Total Items: {statistics.totalItems}</p>
      </div>
      <ul>
        {filteredData.map((item) => (
          <li key={item.city_name}>{item.city_name}</li>
        ))}
      </ul> */}
    </div>
  );
}

export default App
