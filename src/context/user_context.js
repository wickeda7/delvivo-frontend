import React, { useContext, useEffect, useState, useReducer } from 'react';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_USER_LOADED,
  LOGOUT,
} from '../actions';
import reducer from '../reducers/user_reducers';
import { API, BEARER, CLOVER, AUTH_TOKEN } from '../utils/constants';
import { getToken, setToken, removeToken } from '../utils/helpers';
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const authToken = getToken(AUTH_TOKEN);
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

  useEffect(() => {
    const url = window.location.href;
    getMerchantInfo(url);
  }, []);

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
        setToken(CLOVER, JSON.stringify(clover));
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
  const getAccessToken = async (clientId, secret, code) => {
    const connectionHelper = new ConnectionHelper();
    const token = connectionHelper.getOAuthTokenUrl(
      oAuthDomain,
      clientId,
      secret,
      code
    );
    //https://sandbox.dev.clover.com/oauth/token?response_type=token&client_id=2A7R5WP9NSMFY&client_secret=e38d8891-7e6b-2d3c-fc87-56cf372e84d0&code=53939831-e60c-a113-f1dc-b57951754563
    //https://sandbox.dev.clover.com/oauth/token?client_id=2A7R5WP9NSMFY&client_secret=e38d8891-7e6b-2d3c-fc87-56cf372e84d0&code=53939831-e60c-a113-f1dc-b57951754563
    //http://localhost:3000/?merchant_id=M04E9FZBWVB71&employee_id=TRHWGB67A362J&client_id=2A7R5WP9NSMFY#access_token=e1535f80-f828-e0aa-d123-4ad09da104c3
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

    // dispatch({ type: LOGIN_CLOVER }); //
    // try {
    //   const response = await fetch(`http://localhost:1337/api/clover`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   const data = await response.json();
    //   if (data?.error) {
    //     toast.error(data.error.message);
    //   } else {
    //     // // set the token
    //     // setToken(data.jwt);
    //     // dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    //     // setIsModalOpen(true);
    //   }
    // } catch (error) {}
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
    } else {
      // set the token
      setToken(AUTH_TOKEN, data.jwt);
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
      setIsModalOpen(true);
    }
  };
  const logout = () => {
    removeToken(AUTH_TOKEN);
    dispatch({ type: LOGOUT });
  };
  return (
    <UserContext.Provider
      value={{
        ...state,
        logout,
        setIsModalOpen,
        isModalOpen,
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
