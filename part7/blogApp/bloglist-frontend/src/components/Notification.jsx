import { useNotification } from '../hooks';

const Notification = () => {
  const { notification } = useNotification();

  if (!notification) {
    return null;
  }

  return (
    <div className={`notification ${notification.status}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
