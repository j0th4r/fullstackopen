import { useMutation, useQuery } from '@apollo/client/react';
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries';
import { useState } from 'react';

const BirthYearForm = () => {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submitHandler = async (event) => {
    event.preventDefault();

    console.log('update birth year...');
    console.log(name);
    console.log(birthYear);
    //updateAuthor mutation to set or upodate author's birth year
    updateAuthor({ variables: { name, setBornTo: birthYear } });

    setName('');
    setBirthYear('');
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submitHandler}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={birthYear}
            onChange={({ target }) => setBirthYear(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

const Authors = ({ show }) => {
  const { data: authorsData, loading } = useQuery(ALL_AUTHORS);

  if (loading) {
    return <div>loading...</div>;
  }

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authorsData.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <BirthYearForm />
    </div>
  );
};

export default Authors;
