import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';

const PrivateAdminRoute = ({ children }) => {
  const { user } = useUserContext();
  //   console.log(user.role); // admin123

  // if (!user || user.roleId !== 3) {
  //   return <Navigate to='/' />;
  // }
  return children;
};

export default PrivateAdminRoute;
