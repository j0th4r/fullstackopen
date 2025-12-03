export const initialState = null;

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'MOUNT_USER':
      return payload;

    case 'CLEAR_USER':
      return null;

    default:
      return state;
  }
};