import { useState } from 'react';
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries';
import { useMutation } from '@apollo/client/react';

const BirthYearForm = ({ authors }) => {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submitHandler = async (event) => {
    event.preventDefault();
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
          <select
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            <option value="">Choose an author...</option>
            {authors.map((author) => {
              return <option key={author.id} value={author.name}>{author.name}</option>;
            })}
          </select>
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

export default BirthYearForm;
