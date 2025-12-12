import { useQuery } from '@apollo/client/react';
import { ALL_AUTHORS } from '../queries';
import BirthYearForm from './BirthYearForm';

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

      <BirthYearForm authors={authorsData.allAuthors} />
    </div>
  );
};

export default Authors;
