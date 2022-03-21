import React, { useEffect, useState } from 'react';
import Filter from './components/Filter';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons'

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState({ content: null })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
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

    const person = persons.find(p => p.name === newName)

    if(person) {
      checkNumberChange(person.id)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
  
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showMessage(`Added ${newName}`, 'success')
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          showMessage(`${error.response.data.error}`, 'error')
        })
    }
  }

  const handleDeleteClick = (id, name) => {
    if(window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(
          setPersons(persons.filter(person => person.id !== id))
        )
    }
  }

  const checkNumberChange = id => {
    if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const person = persons.find(p => p.id === id)
      const changePerson = { ...person, number: newNumber }

      personService
        .update(id, changePerson)
        .then(returnedPerson => {
          if(returnedPerson){
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            showMessage(`Replaced number of ${newName}`, 'success')
            setNewName('')
            setNewNumber('')
          } else {
            showMessage(`Information of ${newName} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== id))
          }
        })
        .catch(error => {
          showMessage(`${error.response.data.error}`, 'error')
        })
    }
  }

  const showMessage = (content, type) => {
    setMessage({ content, type })
    setTimeout(() => {
      setMessage({ content: null })
    }, 5000)
  }

  const personsToShow = showFilter ? filter : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} nameValue={newName} onChangeName={handleNameChange} numberValue={newNumber} onChangeNumber={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDeleteClick} />
    </div>
  )
}

export default App
