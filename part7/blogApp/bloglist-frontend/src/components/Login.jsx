import loginService from '../services/login';
import blogService from '../services/blogs';
import { useState } from 'react';
import { useLoggedUser, useNotification } from '../hooks';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setNotification } = useNotification();
  const { login } = useLoggedUser();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      login(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      setNotification(
        error.response?.data?.error ?? 'Something went wrong',
        'error',
        5
      );
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );
};
export default Login;
