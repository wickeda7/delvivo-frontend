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
  const loginUser = async (email, password) => {
    dispatch({ type: LOGIN }); //
    try {
      const value = {
        identifier: email,
        password: password,
      };
      const response = await fetch(`${API}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      });
      const data = await response.json();
      userInfo(data);
      return data;
    } catch (error) {
      dispatch({ type: LOGIN_ERROR, payload: error });
    }
  };

  const registerUser = async (name, email, password) => {
    const value = {
      username: name,
      email,
      password,
    };
    console.log(`${API}/auth/local/register!!!`);
    try {
      dispatch({ type: LOGIN });
      const response = await fetch(`${API}/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      });
      const data = await response.json();
      userInfo(data);
      return data;
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
