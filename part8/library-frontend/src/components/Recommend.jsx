import { ALL_BOOKS, ME } from '../queries';
import { useQuery } from '@apollo/client/react';

const Recommend = ({ show }) => {
  const { data: meData, loading: meLoading } = useQuery(ME);

  const favoriteGenre = meData?.me?.favoriteGenre;

  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  });

  if (!show) return null;
  if (meLoading || booksLoading) return <div>loading...</div>;

  return (
    <div>
      <h2>recommendations</h2>

      <div>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksData?.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
