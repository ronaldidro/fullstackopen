import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  
  const [filter, setFilter] = useState('');
  const [countries, setCountries] = useState([]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    fetchCountries(event.target.value)
  }
  
  const fetchCountries = (pref) => {
    axios
      .get(`https://restcountries.com/v2/name/${pref}`)
      .then(response => {
        console.log('response', response.data);
        setCountries(response.data);
      })
  }

  console.log('countries', countries);

  const showContent = () => {
    if(countries.length > 10) return <p>Too many matches, specify another filter</p>
    if(countries.length > 1 && countries.length <= 10) {
      return (
        countries.map(country => (
          <p key={country.alpha2Code}>{country.name}</p>
        ))
      )
    }
    if(countries.length === 1) {
      console.log('entre');
      <div>
        <h1>countries[0]</h1>
      </div>
    }
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        console.log('response', response);
      })
  }, []);

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
      {showContent()}
    </div>    
  );
}

export default App;
