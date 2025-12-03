import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import NotificationProvider from './contexts/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </Provider>
);
