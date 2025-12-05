import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import blogService from '../services/blogs';

const Blogs = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  } );

  if (isLoading) {
    return <div>loading data...</div>;
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes;

  return (
    <div>
      {blogs.sort(byLikes).map((blog) => (
        <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
