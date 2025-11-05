import { useSelector, useDispatch } from 'react-redux';
import { addVote } from '../reducers/anecdoteReducer';
import {
  setNotification,
} from '../reducers/notificationReducer';


const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    const filtered = anecdotes.filter(
      (anecdote) =>
        anecdote.content.toLowerCase().search(filter.toLowerCase()) > -1
    );

    return filtered.sort((a, b) => b.votes - a.votes);
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    const anecdote = anecdotes.find((n) => n.id === id);
    dispatch(addVote(id));
    dispatch(setNotification(`You voted ${anecdote.content}`))
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};
export default AnecdoteList;
