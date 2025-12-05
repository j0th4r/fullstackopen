export const initialState = null;

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET':
      return payload;

    case 'CLEAR':
      return null;

    default:
      return state;
  }
};