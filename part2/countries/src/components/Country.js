import React, { useState } from 'react'
import CountryData from './CountryData'

const Country = ({ country }) => {
  const [showData, setShowData] = useState(false)
  
  const handleShowClick = () => setShowData(!showData)
  
  return(
    <div>
      <span>{country.name}</span>
      <button onClick={handleShowClick}>{showData ? 'hide': 'show'}</button>
      {showData && <CountryData country={country} />}
    </div>
  )
}

export default Country