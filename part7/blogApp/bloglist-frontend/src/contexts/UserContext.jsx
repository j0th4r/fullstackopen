import { createContext, useReducer } from 'react';
import { initialState, userReducer } from '../reducers/userReducer';

export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, initialState);

  const login = (user) => {
    dispatch({
      type: 'MOUNT_USER',
      payload: user
    });
  };

  const logout = () => {
    dispatch({
      type: 'CLEAR_USER'
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
