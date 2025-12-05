import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import usersService from '../services/users';

const Users = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll
  });

  if (isLoading) {
    return <div>loading data...</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
