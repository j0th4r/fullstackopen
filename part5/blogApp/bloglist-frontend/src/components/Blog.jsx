import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, blogs, setBlogs, showNotification, user }) => {
  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? '' : 'none' };
  const nameOfUser = blog.user ? blog.user.name : 'anonymous';

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      });
      setBlogs(
        blogs.map((b) =>
          b.id === blog.id ? { ...updatedBlog, user: blog.user } : b
        )
      );
      showNotification(
        `You liked ${updatedBlog.title} by ${updatedBlog.author}`,
        'success'
      );
    } catch (error) {
      showNotification(
        error.response?.data?.error ?? 'Something went wrong',
        'error'
      );
      console.error(error);
    }
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        showNotification(
          `Blog ${blog.title}, by ${blog.author} removed`,
          'success'
        );
      } catch (error) {
        showNotification(
          error.response?.data?.error ?? 'Something went wrong',
          'error'
        );
        console.error(error);
      }
    }
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={toggleVisibility}>{!visible ? 'view' : 'hide'}</button>
      <div style={showWhenVisible}>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          likes {blog.likes}
          <button style={{ marginLeft: 3 }} onClick={() => addLike(blog)}>
            like
          </button>
        </div>
        <div>{nameOfUser}</div>
        {user.name === nameOfUser && <button onClick={() => removeBlog(blog)}>remove</button>}
      </div>
    </div>
  );
};

export default Blog;
