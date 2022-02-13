import { useState } from "react";
import axios from "axios";
import Countries from "./components/Countries";
import CountryData from "./components/CountryData";

function App() {
  
  const [filter, setFilter] = useState('');
  const [countries, setCountries] = useState([]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    if(event.target.value) fetchCountries(event.target.value) 
    else setCountries([])
  }
  
  const fetchCountries = (value) => {
    axios
      .get(`https://restcountries.com/v2/name/${value}`)
      .then(response => {
        setCountries(response.data);
      })
  }

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
      {countries.length > 10 && <p>Too many matches, specify another filter</p>}
      {countries.length > 1 && countries.length <= 10 && <Countries countries={countries} />}
      {countries.length === 1 && <CountryData country={countries[0]} />}
    </div>    
  );
}

export default App;
