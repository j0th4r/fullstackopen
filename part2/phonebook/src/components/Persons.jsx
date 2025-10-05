import personService from '../services/persons';

function Persons({ persons, setPersons, filter }) {
  const searchResults = persons?.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  ) || [];

  const deletePerson = (id) => {
    personService.deletePerson(id).then(() => {
      setPersons(persons.filter(person => person.id !== id));
      console.log(`Deleted person with id: ${id}`);
    });
  }

  return (
    <>
      {searchResults.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}
export default Persons