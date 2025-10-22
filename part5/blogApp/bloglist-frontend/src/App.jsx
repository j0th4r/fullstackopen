import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Notification from './components/Notification';
import './index.css';
import NewBlog from './components/NewBlog';
import Login from './components/Login';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

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

  const blogFormRef = useRef();

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogappUser');
    blogService.setToken(null);
    setUser(null);
  };

  const onCreate = (blog) => {
    blogFormRef.current.toggleVisibility()
    setBlogs((prev) => [...prev, {...blog, user}])
  }

  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={notification?.message}
        status={notification?.type}
      />
      {!user && <Login setUser={setUser} showNotification={showNotification} />}
      {user && (
        <>
          <div>
            <span>{user.name} logged in</span>{' '}
            <button onClick={handleLogout}>logout</button>
          </div>

          <Togglable buttonLabel="new blog" ref={blogFormRef} >
            <NewBlog
              onCreate={onCreate}
              showNotification={showNotification}
            />
          </Togglable>

          <br />
          {blogs.sort(byLikes).map((blog) => (
            <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} showNotification={showNotification} user={user} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
