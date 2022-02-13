import React from 'react'

const CountryInfo = ({ name, capital, population }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>capital {capital}</p>
      <p>population {population}</p>
    </div>
  )
}

export default CountryInfo