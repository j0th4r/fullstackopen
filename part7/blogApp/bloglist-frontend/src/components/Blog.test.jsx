import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { vi } from 'vitest';

test('renders blog title and author except URL or likes', () => {
  const blog = {
    title: 'Testing Blog API',
    author: 'Mark Markkanen',
    url: 'https://testurl.com/',
    likes: 5,
  };

  const mockUser = {
    username: 'newuser',
    name: 'New User',
  };

  const { container } = render(<Blog blog={blog} user={mockUser} />);
  const div = container.querySelector('.blog');
  const details = container.querySelector('.details');
  expect(div).toHaveTextContent('Testing Blog API Mark Markkanen');
  expect(details).not.toBeVisible();
});

test('clicking the button show details', async () => {
  const blog = {
    title: 'Testing Blog API',
    author: 'Mark Markkanen',
    url: 'https://testurl.com/',
    likes: 5,
  };

  const mockUser = {
    username: 'newuser',
    name: 'New User',
  };

  render(<Blog blog={blog} user={mockUser} />);

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);
  screen.getByText('https://testurl.com/');
  screen.getByText('likes 5');
});

test('clicking the like button twice calls addLike twice', async () => {
  const blog = {
    title: 'Testing Blog API',
    author: 'Mark Markkanen',
    url: 'https://testurl.com/',
    likes: 5,
  };

  const mockUser = {
    username: 'newuser',
    name: 'New User',
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} user={mockUser} addLike={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  const likeButton = screen.getByText('like');
  await user.click(likeButton);
  await user.click(likeButton);
  expect(mockHandler).toHaveBeenCalledTimes(2);
});
