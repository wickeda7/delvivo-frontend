import React, { useContext, useEffect, useReducer } from 'react';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_USER_LOADED,
  LOGOUT,
} from '../actions';
import reducer from '../reducers/user_reducers';
import { API, BEARER, AUTH_TOKEN } from '../utils/constants';
import { getStorage, setStorage, removeStorage } from '../utils/helpers';
import { toast } from 'react-toastify';
import { apiMerchant } from '../api/apiMerchant';
import { apiUser } from '../api/apiUser';

const initialState = {
  isLoading: false,
  user: undefined,
  error: null,
  loginSuccess: false,
  clover: {
    isCloverLoading: false,
  },
};

const UserContext = React.createContext();
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authToken = getStorage(AUTH_TOKEN);
  const fetchLoggedInUser = async (token) => {
    try {
      const response = await fetch(`${API}/users/me`, {
        headers: { Authorization: `${BEARER} ${token}` },
      });
      const data = await response.json();
      dispatch({ type: LOGIN_USER_LOADED, payload: data });
    } catch (error) {
      toast.error('Error While Getting Logged In User Details');
    } finally {
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchLoggedInUser(authToken);
    }
  }, [authToken]);

  const loginClover = async () => {
    const orderType = await apiMerchant.getOrderType();
    console.log(orderType);

    // let finalRedirect = window.location.href.replace(window.location.hash, '');
    // const connectionHelper = new ConnectionHelper();
    // const oAuthRedirectUrl = connectionHelper.getOAuthUrl(
    //   oAuthDomain,
    //   clientId,
    //   null,
    //   finalRedirect
    // );
    // window.location.href = oAuthRedirectUrl;
  };
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
      dispatch({ type: LOGIN_ERROR, payload: error });
    }
  };

  const registerUser = async (value) => {
    try {
      dispatch({ type: LOGIN });
      const res = await apiUser.register(value);
      userInfo(res.data);
      return res.data;
    } catch (error) {}
  };

  const userInfo = (data) => {
    if (data?.error) {
      toast.error(data.error.message);
      dispatch({ type: LOGIN_ERROR, payload: data.error.message });
    } else {
      // set the token
      setStorage(AUTH_TOKEN, data.jwt);
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    }
  };
  const logout = () => {
    removeStorage(AUTH_TOKEN);
    dispatch({ type: LOGOUT });
  };
  return (
    <UserContext.Provider
      value={{
        ...state,
        logout,
        loginUser,
        registerUser,
        loginClover,
        members,
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
