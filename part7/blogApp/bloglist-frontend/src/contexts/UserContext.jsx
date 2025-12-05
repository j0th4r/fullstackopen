import { createContext, useContext, useReducer } from 'react';
import { initialState, userReducer } from '../reducers/userReducer';
import loginService from '../services/login';
import storageService from '../services/storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={[user, userDispatch ]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const [value] = useContext(UserContext);

  return value;
};

export const useLogin = () => {
  const [, dispatch] = useContext(UserContext);

  return async (credentials) => {
    const user = await loginService.login(credentials);
    dispatch({
      type: 'SET',
      payload: user
    });
    storageService.saveUser(user);
  };
};

export const useLogout = () => {
  const [, dispatch] = useContext(UserContext);

  return async () => {
    dispatch({ type: 'CLEAR' });
    storageService.removeUser();
  };
};

export const useInitUser = () => {
  const [, dispatch] = useContext(UserContext);

  return async () => {
    const user = await storageService.loadUser();
    if (user) {
      dispatch({
        type: 'SET',
        payload: user
      });
    }
  };
};

export default UserProvider