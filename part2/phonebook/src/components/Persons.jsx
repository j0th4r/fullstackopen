import personService from '../services/persons';

function Persons({persons, setPersons, filter, showNotification}) {
  const searchResults =
    persons?.filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    ) || [];

  const deletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);

    if (!window.confirm(`Delete ${personToDelete?.name}?`)) {
      return;
    }

    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        showNotification(`Deleted ${personToDelete.name}`, 'success');
      })
      .catch((error) => {
        showNotification(
          `Information of ${personToDelete.name} has already been removed from the server`,
          'error'
        );
        setPersons(persons.filter((person) => person.id !== id));
        console.log(error.response.data.error);
      });
  };

  return (
    <>
      {searchResults.map((person) => (
        <div key={person.id}>
          {person.name} {person.number} {' '}
          <button onClick={() => deletePerson(person.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}
export default Persons;
