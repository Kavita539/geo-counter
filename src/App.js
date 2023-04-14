import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';  

function App() {
  const [clickCount, setClickCount] = useState(
    parseInt(localStorage.getItem("clickCount")) || 0
  );
  const [countryClicks, setCountryClicks] = useState(
    JSON.parse(localStorage.getItem("countryClicks")) || []
  );
  
  useEffect(() => {
    localStorage.setItem("clickCount", clickCount);
    localStorage.setItem("countryClicks", JSON.stringify(countryClicks));
  }, [clickCount, countryClicks]);

  const clickHandler = async () => {
    setClickCount(clickCount + 1);

    try {
      const response = await axios.get("https://ipapi.co/json/");
      const country = response.data.country_name;
      const countryCode = response.data.country;
      const newCountryClicks = [...countryClicks];
      const existingCountry = newCountryClicks.find(
        (country) => country.countryCode === countryCode
      );
      if (existingCountry) {
        existingCountry.count += 1;
      } else {
        newCountryClicks.push({
          countryCode,
          countryName: country,
          count: 1,
        });
      }
      setCountryClicks(newCountryClicks);
    } catch (error) {
      console.log(error);
    }
  };
  
  const resetHandler = () => {
    setClickCount(0);
    setCountryClicks([]);
    localStorage.removeItem("clickCount");
    localStorage.removeItem("countryClicks");
  };

  return (
    <div className="App">
      <h1>Click Counter</h1>
      <div className='btn-cta'>
      <button onClick={clickHandler} className='click-btn'>Click Me!</button>
      <button onClick={resetHandler} className='reset-btn'>Reset</button>
      </div>
      <p className='count-display'>Click Count: {clickCount}</p>
      <table className="table">
        <thead>
          <tr className='table-row'>
            <th className='table-header'>Country Code</th>
            <th className='table-header'>Country Name</th>
            <th className='table-header'>Count</th>
          </tr>
        </thead>
        <tbody>
          {countryClicks.map((country) => (
            <tr key={country.countryCode}>
              <td className='table-data'>{country.countryCode}</td>
              <td className='table-data'>{country.countryName}</td>
              <td className='table-data'>{country.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
