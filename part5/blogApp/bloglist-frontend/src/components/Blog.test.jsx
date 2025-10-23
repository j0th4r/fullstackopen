import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('renders blog title and author except URL or likes', () => {
  const blog = {
    title: 'Testing Blog API',
    author: 'Mark Markkanen',
    url: 'https://testurl.com/',
    likes: 5,
  };

  const user = {
    username: 'newuser',
    name: 'New User',
  };

  const { container } = render(<Blog blog={blog} user={user} />);
  const div = container.querySelector('.blog');
  const details = container.querySelector('.details')
  expect(div).toHaveTextContent('Testing Blog API Mark Markkanen');
  expect(details).not.toBeVisible();
});
