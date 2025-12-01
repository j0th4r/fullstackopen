import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return null;
    }
  }
});

let timeoutId;

export const setNotification = (message, status, seconds) => {
  return (dispatch) => {
    clearTimeout(timeoutId);

    dispatch(showNotification({ message, status }));
    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
  };
};

export const { showNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
