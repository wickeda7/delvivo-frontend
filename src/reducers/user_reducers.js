import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_USER_LOADED,
  LOGOUT,
} from '../actions';

const user_reducer = (state, action) => {
  if (action.type === LOGIN) {
    return { ...state, isLoading: true, loginSuccess: false };
  }
  if (action.type === LOGIN_ERROR) {
    return {
      ...state,
      error: action.payload,
      isLoading: false,
      loginSuccess: false,
    };
  }
  if (action.type === LOGIN_SUCCESS) {
    return {
      ...state,
      user: action.payload,
      isLoading: false,
      loginSuccess: true,
    };
  }
  if (action.type === LOGIN_USER_LOADED) {
    return {
      ...state,
      user: action.payload,
      isLoading: false,
      loginSuccess: false,
    };
  }
  if (action.type === LOGOUT) {
    return {
      ...state,
      user: undefined,
      isLoading: false,
      loginSuccess: false,
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default user_reducer;
