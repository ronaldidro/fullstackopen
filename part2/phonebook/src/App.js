import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  
  const [ persons, setPersons ] = useState([])
  const [ filter, setFilter ] = useState([])
  const [ showFilter, setShowFilter ] = useState(false)
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, []);  

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => {
    const filteredPersons = persons.filter(person => person.name.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()));
    setShowFilter(true)
    setFilter(filteredPersons)
  }
  
  const addPerson = (event) => {
    event.preventDefault()

    const repeated = persons.some(person => person.name === newName)
    if(repeated) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }
    
    setShowFilter(false)
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = showFilter ? filter : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} nameValue={newName} onChangeName={handleNameChange} numberValue={newNumber} onChangeNumber={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
