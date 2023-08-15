import React, { useContext, useEffect, useReducer } from 'react';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_USER_LOADED,
  LOGOUT,
} from '../actions';
import reducer from '../reducers/user_reducers';
import { API, BEARER, CLOVER, AUTH_TOKEN } from '../utils/constants';
import { getStorage, setStorage, removeStorage } from '../utils/helpers';
import { toast } from 'react-toastify';
import ConnectionHelper from '../utils/connectionHelper';
const initialState = {
  isLoading: false,
  user: undefined,
  error: null,
  loginSuccess: false,
  clover: {
    isCloverLoading: false,
  },
};

const oAuthDomain = process.env.REACT_APP_CLOVER;
const clientId = process.env.REACT_APP_ID;
const clientSecret = process.env.REACT_APP__SECRET;
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

  const getMerchantInfo = (url) => {
    if (url.includes('merchant')) {
      const merchant_regex = new RegExp('merchant_id=(.*)&em.*');
      const token_regex = new RegExp('access_token=(.*)');
      const merchant_array = merchant_regex.exec(window.location.search);
      const token_array = token_regex.exec(window.location.hash);
      if (merchant_array) {
        const queryParameters = new URLSearchParams(merchant_array[0]);
        const access_token = token_array[1];
        const clover = {
          merchant_id: queryParameters.get('merchant_id'),
          employee_id: queryParameters.get('employee_id'),
          client_id: queryParameters.get('client_id'),
          code: queryParameters.get('code'),
          access_token: access_token,
        };
        setStorage(CLOVER, JSON.stringify(clover));
        if (!token_array[1]) {
          getAccessToken(
            queryParameters.get('client_id'),
            clientSecret,
            queryParameters.get('code')
          );
        }
      }
    }
  };
  useEffect(() => {
    const url = window.location.href;
    getMerchantInfo(url);
  }, []);
  const getAccessToken = async (clientId, secret, code) => {
    const connectionHelper = new ConnectionHelper();
    const token = connectionHelper.getOAuthTokenUrl(
      oAuthDomain,
      clientId,
      secret,
      code
    );
  };
  const loginClover = async () => {
    let finalRedirect = window.location.href.replace(window.location.hash, '');
    const connectionHelper = new ConnectionHelper();
    const oAuthRedirectUrl = connectionHelper.getOAuthUrl(
      oAuthDomain,
      clientId,
      null,
      finalRedirect
    );
    window.location.href = oAuthRedirectUrl;
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
