import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    updateAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload.id ? action.payload : anecdote
      );
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

const { setAnecdotes, createAnecdote, updateAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createNew(content);
    dispatch(createAnecdote(anecdote));
  };
};

export const incrementVote = (id) => {
  return async (dispatch, getState) => {
    const state = getState();
    const anecdoteToUpdate = state.anecdotes.find((a) => a.id === id);
    const anecdote = await anecdoteService.updateVote(id, anecdoteToUpdate);
    dispatch(updateAnecdote(anecdote));
  };
};

export default anecdoteSlice.reducer;
