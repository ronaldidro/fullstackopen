import React from 'react'
import Language from './Language'

const Languages = ({ languages }) => {
  return (
    <div>
      <h3>Spoken languages</h3>
      <ul>
        {languages.map(language => (
          <Language key={language.name} name={language.name} />
        ))}
      </ul>
    </div>
  )
}

export default Languages