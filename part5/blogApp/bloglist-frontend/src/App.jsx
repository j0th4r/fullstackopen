import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Notification from './components/Notification';
import './index.css';
import NewBlog from './components/NewBlog';
import Login from './components/Login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    async function getBlogs() {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    }

    getBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogappUser');
    blogService.setToken(null);
    setUser(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={notification?.message}
        status={notification?.type}
      />
      {!user && <Login username={username} setUsername={setUsername} password={password} setPassword={setPassword} setUser={setUser} showNotification={showNotification} />}
      {user && (
        <>
          <div>
            <span>{user.name} logged in</span>{' '}
            <button onClick={handleLogout}>logout</button>
          </div>

          <NewBlog blogs={blogs} setBlogs={setBlogs} showNotification={showNotification}/>

          <br />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
