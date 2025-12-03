import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext.jsx';
import { UserContext } from '../contexts/UserContext.jsx';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const useLoggedUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
