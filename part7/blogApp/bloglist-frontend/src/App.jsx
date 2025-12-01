import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Notification from './components/Notification';
import './index.css';
import NewBlog from './components/NewBlog';
import Login from './components/Login';
import Togglable from './components/Togglable';
import { setNotification } from './reducers/notificationReducer';
import { useDispatch } from 'react-redux';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

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

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogappUser');
    blogService.setToken(null);
    setUser(null);
  };

  const onCreate = async (blog) => {
    try {
      const returnedBlog = await blogService.create(blog);
      blogFormRef.current.toggleVisibility();
      setBlogs((prev) => [...prev, { ...returnedBlog, user }]);
      dispatch(
        setNotification(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          'success',
          5
        )
      );
    } catch (error) {
      dispatch(
        setNotification(
          error.response?.data?.error ?? 'Something went wrong',
          'error',
          5
        )
      );
      console.error(error);
    }
  };

  const addLike = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1
      });
      setBlogs(
        blogs.map((b) =>
          b.id === blog.id ? { ...updatedBlog, user: blog.user } : b
        )
      );
      dispatch(
        setNotification(
          `You liked ${updatedBlog.title} by ${updatedBlog.author}`,
          'success',
          5
        )
      );
    } catch (error) {
      dispatch(
        setNotification(
          error.response?.data?.error ?? 'Something went wrong',
          'error',
          5
        )
      );
      console.error(error);
    }
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        dispatch(
          setNotification(
            `Blog ${blog.title}, by ${blog.author} removed`,
            'success',
            5
          )
        );
      } catch (error) {
        dispatch(
          setNotification(
            error.response?.data?.error ?? 'Something went wrong',
            'error',
            5
          )
        );
        console.error(error);
      }
    }
  };

  const byLikes = (a, b) => b.likes - a.likes;

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {!user && <Login setUser={setUser} />}
      {user && (
        <>
          <div>
            <span>{user.name} logged in</span>{' '}
            <button onClick={handleLogout}>logout</button>
          </div>

          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <NewBlog onCreate={onCreate} />
          </Togglable>

          <br />
          {blogs.sort(byLikes).map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={addLike}
              removeBlog={removeBlog}
              user={user}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
