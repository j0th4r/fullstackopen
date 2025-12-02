import { createSlice } from '@reduxjs/toolkit';

const blogReducer = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    getBlog(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const blog = state.find((blog) => blog.id === action.payload.id);
      if (blog) {
        Object.assign(blog, action.payload);
      }
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    }
  }
});

export const { getBlog, addBlog, updateBlog, deleteBlog } = blogReducer.actions;

export default blogReducer.reducer;
