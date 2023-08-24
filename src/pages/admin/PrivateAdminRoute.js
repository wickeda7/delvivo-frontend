import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';

const PrivateAdminRoute = ({ children }) => {
  const { user } = useUserContext();
  //   console.log(user);
  //   console.log(user.role); // admin123
  if (!user) {
    return <Navigate to='/' />;
  }
  return children;
};

export default PrivateAdminRoute;
