import React, { useContext, useReducer, useEffect } from 'react';
import { LOGIN, LOGIN_ERROR, LOGOUT } from '../actions';
import reducer from '../reducers/user_reducers';
import { USER_INFO } from '../utils/constants';
import { setStorage, removeStorage, getUser } from '../utils/helpers';
import { toast } from 'react-toastify';
import { apiMerchant } from '../api/apiMerchant';
import { apiUser } from '../api/apiUser';

const initialState = {
  isLoading: false,
  //user: undefined,
  error: null,
  loginSuccess: false,
  clover: {
    isCloverLoading: false,
  },
};

const UserContext = React.createContext();
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLogin, setIsLogin] = React.useState(false);
  let user = getUser(USER_INFO);
  useEffect(() => {
    user = getUser(USER_INFO);
  }, [isLogin]);

  const members = async (data) => {
    let user = null;
    if (data.admin) {
      user = await registerUser(data);
      return user;
    }
    if (!data.isMember) {
      user = await registerUser(data);
    } else {
      user = await loginUser(data.email, data.password);
    }
    return user;
  };
  const loginUser = async (email, password) => {
    try {
      const value = {
        identifier: email,
        password: password,
      };
      dispatch({ type: LOGIN }); //
      const res = await apiUser.login(value);
      userInfo(res.data);

      return res.data;
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response; // take everything but 'request'
      toast.error(errorObject.data.error.message);
      dispatch({ type: LOGIN_ERROR, payload: errorObject.data.error.message });
    }
  };

  const registerUser = async (value) => {
    try {
      dispatch({ type: LOGIN });
      const res = await apiUser.register(value);
      userInfo(res.data);
      return res.data;
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response; // take everything but 'request'
      toast.error(errorObject.data.error.message);
      dispatch({ type: LOGIN_ERROR, payload: errorObject.data.error.message });
    }
  };

  const userInfo = (data) => {
    var now = Date.now(); //millisecs since epoch time, lets deal only with integer
    const expires = Math.abs(1000 * 60 * 60 * 12);
    data.timestamp = now + expires;
    setStorage(USER_INFO, JSON.stringify(data));
    setIsLogin(true);
  };
  const logout = () => {
    removeStorage(USER_INFO);
    dispatch({ type: LOGOUT });
    setIsLogin(false);
  };
  return (
    <UserContext.Provider
      value={{
        ...state,
        logout,
        members,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
// make sure use
export const useUserContext = () => {
  return useContext(UserContext);
};
