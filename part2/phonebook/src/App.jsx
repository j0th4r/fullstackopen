import {useState, useEffect} from 'react';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Filter from './components/Filter';
import personService from './services/persons';
import Notification from './components/Notification';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'error') => {
    setNotification({message, type});
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification?.message} status={notification?.type} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>add a new</h3>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        showNotification={showNotification}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        setPersons={setPersons}
        filter={filter}
        showNotification={showNotification}
      />
    </div>
  );
};

export default App;
