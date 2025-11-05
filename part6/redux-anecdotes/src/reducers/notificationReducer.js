import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'render here notification...',
  reducers: {
    showNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return null;
    },
  },
});

let timeoutID;
export const setNotification = (message) => {
  return (dispatch) => {
    clearTimeout(timeoutID);

    dispatch(showNotification(message));
    timeoutID = setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };
};



export const { showNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
