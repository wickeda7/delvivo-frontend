import React, { useContext, useReducer } from 'react';
import { LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT } from '../actions';
import reducer from '../reducers/user_reducers';
import { AUTH_TOKEN } from '../utils/constants';
import { setStorage, removeStorage } from '../utils/helpers';
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

  // const authToken = getStorage(AUTH_TOKEN);
  // const fetchLoggedInUser = async (token) => {
  //   try {
  //     const response = await fetch(`${API}/users/me`, {
  //       headers: { Authorization: `${BEARER} ${token}` },
  //     });
  //     const data = await response.json();
  //     dispatch({ type: LOGIN_USER_LOADED, payload: data });
  //   } catch (error) {
  //     toast.error('Error While Getting Logged In User Details');
  //   } finally {
  //   }
  // };

  // useEffect(() => {
  //   if (authToken) {
  //     fetchLoggedInUser(authToken);
  //   }
  // }, [authToken]);

  const loginClover = async () => {
    const orderType = await apiMerchant.getOrderType();

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
    setStorage(AUTH_TOKEN, data.jwt);
    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
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
