import React, { useContext, useEffect, useState, useReducer } from "react";
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_USER_LOADED,
  LOGOUT,
} from "../actions";
import reducer from "../reducers/user_reducers";
import { API, BEARER } from "../utils/constants";
import { getToken, setToken, removeToken } from "../utils/helpers";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  user: undefined,
  error: null,
  loginSuccess: false,
};

const UserContext = React.createContext();
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const authToken = getToken();

  const fetchLoggedInUser = async (token) => {
    try {
      const response = await fetch(`${API}/users/me`, {
        headers: { Authorization: `${BEARER} ${token}` },
      });
      const data = await response.json();
      dispatch({ type: LOGIN_USER_LOADED, payload: data });
    } catch (error) {
      toast.error("Error While Getting Logged In User Details");
    } finally {
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchLoggedInUser(authToken);
    }
  }, [authToken]);

  const loginUser = async (email, password) => {
    dispatch({ type: LOGIN }); //
    try {
      const value = {
        identifier: email,
        password: password,
      };
      const response = await fetch(`${API}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      setToken(data.jwt);
      dispatch({ type: LOGIN_SUCCESS, payload: data.user });
      setIsModalOpen(true);
    }
  };
  const logout = () => {
    removeToken();
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
