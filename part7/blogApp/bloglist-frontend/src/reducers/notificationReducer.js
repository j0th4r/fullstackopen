export const initialState = null;

export const notificationReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case 'SHOW':
      return {
        ...payload
      };

    case 'CLEAR':
      return null;

    default:
      return state;
  }
};
