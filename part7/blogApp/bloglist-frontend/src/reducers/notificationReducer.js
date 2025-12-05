export const initialState = { message: null };

export const notificationReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case 'SET':
      return {
        ...payload
      };

    case 'CLEAR':
      return initialState;

    default:
      return state;
  }
};
