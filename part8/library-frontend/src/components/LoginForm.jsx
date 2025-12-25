import { useMutation } from '@apollo/client/react';
import React, { useState } from 'react';
import { LOGIN } from '../queries';

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useMutation(LOGIN);

  const submit = async (event) => {
    event.preventDefault();

    //createUser
    const result = await login({ variables: { username, password } });
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('user-token', token);
    }

    setUsername('');
    setPassword('');
    setPage('books');
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <form onSubmit={submit}>
        <div>
          name
          <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;
