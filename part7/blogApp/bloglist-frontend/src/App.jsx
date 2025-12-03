  import { useEffect, useRef, useMemo } from 'react';
  import Blog from './components/Blog';
  import blogService from './services/blogs';
  import Notification from './components/Notification';
  import './index.css';
  import NewBlog from './components/NewBlog';
  import Login from './components/Login';
  import Togglable from './components/Togglable';
  import { useLoggedUser, useNotification } from './hooks';
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

  const App = () => {
    const { setNotification } = useNotification();
    const { user, login, logout } = useLoggedUser()
    const queryClient = useQueryClient();

    const fetchBlogs = async () => {
      return await blogService.getAll();
    };

    const { data: blogs, isPending } = useQuery({
      queryKey: ['blogs'],
      queryFn: fetchBlogs,
      refetchOnWindowFocus: false
    });

    useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        login(user);
        blogService.setToken(user.token);
      }
    }, []);

    const blogFormRef = useRef();

    const handleLogout = (event) => {
      event.preventDefault();
      window.localStorage.removeItem('loggedBlogappUser');
      blogService.setToken(null);
      logout();
    };

    const newBlogMutation = useMutation({
      mutationFn: blogService.create,
      onSuccess: (newBlog) => {
        const blogs = queryClient.getQueryData(['blogs']);
        queryClient.setQueryData(['blogs'], blogs.concat({ ...newBlog, user }));
      }
    });

    const onCreate = async (blog) => {
      try {
        const returnedBlog = await newBlogMutation.mutateAsync(blog);
        blogFormRef.current.toggleVisibility();

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

    const updateBlogMutation = useMutation({
      mutationFn: ({ id, data }) => blogService.update(id, data),
      onSuccess: (updatedBlog, { data }) => {
        const blogs = queryClient.getQueryData(['blogs']);
        queryClient.setQueryData(
          ['blogs'],
          blogs.map((blog) => (blog.id === updatedBlog.id ? { ...updatedBlog, user: data.user } : blog))
        );
      }
    });

    const addLike = async (blog) => {
      try {
        await updateBlogMutation.mutateAsync({
          id: blog.id,
          data: {
            ...blog,
            likes: blog.likes + 1
          }
        });

        setNotification(
          `You liked ${blog.title} by ${blog.author}`,
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

    const deleteBlogMutation = useMutation({
      mutationFn: blogService.remove,
      onSuccess: (data, deletedBlogId) => {
        const blogs = queryClient.getQueryData(['blogs']);
        queryClient.setQueryData(
          ['blogs'],
          blogs.filter((blog) => blog.id !== deletedBlogId)
        );
      }
    });

    const removeBlog = async (blog) => {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        try {
          await deleteBlogMutation.mutateAsync(blog.id);

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
      if (!blogs) return [];
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

            {isPending && <div>Fetching blogs...</div>}

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
