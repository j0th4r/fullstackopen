import { createContext, useReducer, useContext } from 'react';
import {
  initialState,
  notificationReducer
} from '../reducers/notificationReducer';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [counter, counterDispatch] = useReducer(
    notificationReducer,
    initialState
  );

  return (
    <NotificationContext.Provider value={[counter, counterDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const [value] = useContext(NotificationContext);

  return value;
};

export const useNotifier = () => {
  const [, dispatch] = useContext(NotificationContext);

  return (message, type = 'info') => {
    dispatch({
      type: 'SET',
      payload: { message, type }
    });
    setTimeout(() => {
      dispatch({ type: 'CLEAR' });
    }, 5000);
  };
};

export default NotificationProvider;
