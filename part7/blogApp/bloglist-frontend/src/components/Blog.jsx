import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotifier } from '../contexts/NotificationContext';
import blogService from '../services/blogs';
import { useUser } from '../contexts/UserContext';

import { SmallButton, Input } from './styled';

const Blog = () => {
  const [comment, setComment] = useState('');
  const id = useParams().id;

  const notifyWith = useNotifier();
  const navigate = useNavigate();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogService.getOne(id)
  });
  const user = useUser();

  const queryClient = useQueryClient();
  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data, deletedBlogId) => {
      const blogs = queryClient.getQueryData(['blogs']);

      queryClient.setQueryData(
        ['blogs'],

        blogs.filter((blog) => blog.id !== deletedBlogId)
      );
    }
  });

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, data }) => blogService.update(id, data),
    onSuccess: (updatedBlog, { data }) => {
      const blogs = queryClient.getQueryData(['blogs']);

      if (blogs) {
        queryClient.setQueryData(
          ['blogs'],

          blogs.map((blog) =>
            blog.id === updatedBlog.id
              ? { ...updatedBlog, user: data.user }
              : blog
          )
        );
      }
      queryClient.setQueryData(['blogs', updatedBlog.id], {
        ...updatedBlog,
        user: data.user
      });
    }
  });

  const commentBlogMutation = useMutation({
    mutationFn: blogService.comment,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs', updatedBlog.id], updatedBlog);

      const blogs = queryClient.getQueryData(['blogs']);
      if (blogs) {
        queryClient.setQueryData(
          ['blogs'],
          blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
        );
      }
    }
  });

  if (isLoading) {
    return <div>loading data...</div>;
  }

  if (!blog || !user) {
    return null;
  }

  const nameOfUser = blog.user?.name ?? 'anonymous';
  const canRemove = blog.user && blog.user.username === user.username;

  const like = async () => {
    const blogToUpdate = {
      ...blog,
      likes: blog.likes + 1
    };
    await updateBlogMutation.mutateAsync({ id: blog.id, data: blogToUpdate });
    notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`);
  };

  const remove = async () => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`
    );
    if (ok) {
      await removeBlogMutation.mutateAsync(blog.id);
      notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`);
      navigate('/');
    }
  };

  const addComment = async () => {
    commentBlogMutation.mutate({ id: blog.id, comment });
    notifyWith('Comment added!');
    setComment('');
  };

  const margined = { marginBottom: 5 };

  return (
    <div className="blog">
      <div style={margined}>
        <strong>{blog.title} </strong> by <strong>{blog.author}</strong>
      </div>

      <div style={margined}>
        <a href={blog.url}> {blog.url}</a>{' '}
      </div>

      <div style={margined}>
        likes {blog.likes} <SmallButton onClick={like}>like</SmallButton>
      </div>

      <div style={margined}>added by {nameOfUser}</div>
      {canRemove && <SmallButton onClick={remove}>delete</SmallButton>}

      <h3>comments:</h3>

      <Input
        value={comment}
        onChange={({ target }) => setComment(target.value)}
      />
      <SmallButton disabled={comment.length === 0} onClick={addComment}>
        add comment
      </SmallButton>

      <ul>
        {blog.comments.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
