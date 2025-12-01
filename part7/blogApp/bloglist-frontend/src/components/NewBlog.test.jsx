import { render, screen } from '@testing-library/react';
import NewBlog from './NewBlog';
import userEvent from '@testing-library/user-event';

test('<NewBlog /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<NewBlog onCreate={createBlog} />);

  const titleInput = screen.getByLabelText('title:');
  const authorInput = screen.getByLabelText('author:');
  const urlInput = screen.getByLabelText('url:');
  const createButton = screen.getByText('create');

  await user.type(titleInput, 'Testing Blog API');
  await user.type(authorInput, 'Mark Markkanen');
  await user.type(urlInput, 'https://testurl.com/');
  await user.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing Blog API',
    author: 'Mark Markkanen',
    url: 'https://testurl.com/',
  });
});
