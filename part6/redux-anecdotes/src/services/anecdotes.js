const baseUrl = 'http://localhost:3001/anecdotes';

const getId = () => (100000 * Math.random()).toFixed(0);

const getAll = async () => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error('failed to fetch anecdotes');
  }

  const data = await response.json();
  return data;
};

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, id: getId(), votes: 0 }),
  };

  const response = await fetch(baseUrl, options);

  if(!response.ok) {
    throw new Error('Failed to create anecdote')
  }

  return await response.json()
};

const updateVote = async (id, newAnecdote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...newAnecdote, votes: newAnecdote.votes + 1 }),
  };

  const response = await fetch(`${baseUrl}/${id}`, options);

  if (!response.ok) {
    throw new Error('Failed to add vote');
  }

  return await response.json();
};

export default { getAll, createNew, updateVote };
