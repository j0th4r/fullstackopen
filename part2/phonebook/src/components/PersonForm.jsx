import {useState} from 'react';
import personService from '../services/persons';

function PersonForm({persons, setPersons, showNotification}) {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const addPerson = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      if (
        !window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        return;
      }

      const updatedPerson = {...existingPerson, number: newNumber};

      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== existingPerson.id ? person : returnedPerson
            )
          );
          setNewName('');
          setNewNumber('');
        })
        .catch((error) => {
          showNotification(`${error.response.data.error}`, 'error');
          setPersons(
            persons.filter((person) => person.id !== existingPerson.id)
          );
          console.log(error.response.data.error);
        });

      return;
    }

    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        showNotification(`Added ${returnedPerson.name}`, 'success');
      })
      .catch((error) => {
        showNotification(error.response.data.error, 'error');
        console.log(error.response.data.error);
      });
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name:{' '}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}
export default PersonForm;
