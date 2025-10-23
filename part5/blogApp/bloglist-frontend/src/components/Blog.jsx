import { useState } from 'react';

const Blog = ({ blog, addLike, removeBlog, user }) => {
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

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}{' '}
      <button onClick={toggleVisibility}>{!visible ? 'view' : 'hide'}</button>
      <div style={showWhenVisible} className='details'>
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
        {user.name === nameOfUser && (
          <button onClick={() => removeBlog(blog)}>remove</button>
        )}
      </div>
    </div>
  );
};

export default Blog;
