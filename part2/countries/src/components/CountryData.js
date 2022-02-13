import React from 'react'
import CountryInfo from './CountryInfo'
import CountryWeather from './CountryWeather'
import Image from './Image'
import Languages from './Languages'

const CountryData = ({ country }) => {
  return (
    <div>
      <CountryInfo name={country.name} capital={country.capital} population={country.population} />      
      <Languages languages={country.languages} />
      <Image src={country.flags.png} />
      <CountryWeather capital={country.capital} />
    </div>
  )
}

export default CountryData