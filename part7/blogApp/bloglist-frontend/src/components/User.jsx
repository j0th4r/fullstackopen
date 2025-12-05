import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import usersService from '../services/users';

const User = () => {
  const id = useParams().id;
  const { data: user, isLoading } = useQuery({
    queryKey: ['users', id],
    queryFn: () => usersService.getOne(id)
  });

  if (isLoading) {
    return <div>loading data...</div>;
  }

  return (
    <div>
      <h3>{user.name}</h3>

      {user.blogs.length === 0 ? (
        <p>{user.name} has no blogs</p>
      ) : (
        <h4>added blogs</h4>
      )}

      <ul>
        {user.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
