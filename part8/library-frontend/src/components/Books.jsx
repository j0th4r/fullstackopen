import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS } from '../queries';
import BookFilter from './BookFilter';
import { useState } from 'react';

const Books = ({ show }) => {
  const [genre, setGenre] = useState('all genres');
  const { data: booksData, loading } = useQuery(ALL_BOOKS);

  if (loading) {
    return <div>loading...</div>;
  }

  if (!show) {
    return null;
  }

  const booksToShow =
    genre === 'all genres'
      ? booksData.allBooks
      : booksData.allBooks.filter((book) => book.genres.includes(genre));

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <BookFilter books={booksData.allBooks} setGenre={setGenre} />
    </div>
  );
};

export default Books;
