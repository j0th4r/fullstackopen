import { useEffect, useRef, useMemo } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Notification from './components/Notification';
import './index.css';
import NewBlog from './components/NewBlog';
import Login from './components/Login';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog
} from './reducers/blogReducer';
import { setUser, clearUser } from './reducers/userReducer';
import { useNotification } from './hooks';

const App = () => {
  const blogs = useSelector((state) => state.blog);
  const user = useSelector((state) => state.user);
  const { setNotification } = useNotification();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getBlogs() {
      const blogs = await blogService.getAll();
      dispatch(getBlog(blogs));
    }
    getBlogs();
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const blogFormRef = useRef();

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogappUser');
    blogService.setToken(null);
    dispatch(clearUser());
  };

  const onCreate = async (blog) => {
    try {
      const returnedBlog = await blogService.create(blog);
      blogFormRef.current.toggleVisibility();
      dispatch(addBlog({ ...returnedBlog, user }));

      setNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        'success',
        5
      );
    } catch (error) {
      setNotification(
        error.response?.data?.error ?? 'Something went wrong',
        'error',
        5
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
      dispatch(updateBlog({ ...updatedBlog, user: blog.user }));

      setNotification(
        `You liked ${updatedBlog.title} by ${updatedBlog.author}`,
        'success',
        5
      );
    } catch (error) {
      setNotification(
        error.response?.data?.error ?? 'Something went wrong',
        'error',
        5
      );

      console.error(error);
    }
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        dispatch(deleteBlog(blog.id));

        setNotification(
          `Blog ${blog.title}, by ${blog.author} removed`,
          'success',
          5
        );
      } catch (error) {
        setNotification(
          error.response?.data?.error ?? 'Something went wrong',
          'error',
          5
        );
        console.error(error);
      }
    }
  };

  const byLikes = (a, b) => b.likes - a.likes;
  const sortedBlogs = useMemo(() => {
    return [...blogs].sort(byLikes);
  }, [blogs]);

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {!user && <Login />}
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
          {sortedBlogs.map((blog) => (
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
