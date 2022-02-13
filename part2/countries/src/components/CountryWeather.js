import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from './Image'

const CountryWeather = ({ capital }) => {
  const [weather, setWeather] = useState()

  const params = {
    city: capital,
    key: process.env.REACT_APP_API_KEY
  }

  useEffect(() => {
    axios.get('https://api.weatherbit.io/v2.0/current', {params})
      .then(response => {
        setWeather(response.data.data)
      })
  }, []) 

  return (
    <div>
      <h3>Weather in {capital}</h3>
      {weather && (
        <div>
          <div><b>temperature:</b> {weather[0].temp} Celcius </div>
          <Image src={`https://www.weatherbit.io/static/img/icons/${weather[0].weather.icon}.png`} />
          <div><b>wind:</b> {weather[0].wind_spd} mph direction {weather[0].wind_cdir}</div>
        </div>
      )}
    </div>
  )
}

export default CountryWeather