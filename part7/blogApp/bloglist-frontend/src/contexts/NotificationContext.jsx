import { createContext, useReducer } from 'react';
import {
  initialState,
  notificationReducer
} from '../reducers/notificationReducer';

export const NotificationContext = createContext();
let timeoutId;

function NotificationProvider({ children }) {
  const [notification, dispatch] = useReducer(
    notificationReducer,
    initialState
  );

  const setNotification = (message, status, seconds) => {
    clearTimeout(timeoutId);

    dispatch({
      type: 'SHOW',
      payload: { message, status, seconds }
    });

    timeoutId = setTimeout(() => {
      dispatch({ type: 'CLEAR' });
    }, seconds * 1000);
  };

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
