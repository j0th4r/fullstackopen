import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS } from '../queries';
import BookFilter from './BookFilter';
import { useState } from 'react';

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null);
  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS);
  const { data: filteredBooks, loading: filteredBooksLoading } = useQuery(ALL_BOOKS, {
    variables: { genre: genre },
  });

  if (booksLoading || filteredBooksLoading) {
    return <div>loading...</div>;
  }

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>

      {genre === null ? (
        <div>
          in <strong>all genres</strong>
        </div>
      ) : (
        <div>
          in genre <strong>{genre}</strong>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.allBooks.map((a) => (
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
