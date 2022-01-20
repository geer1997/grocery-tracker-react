import React from "react";
import { Navigate } from "react-router-dom";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { auth } from "..";

const PrivateRoute = ({ children, ...remainingProps }) => {
  return (
    isLoaded(auth) && !isEmpty(auth) ?
      children
      :
      <Navigate
        to="/"
      />
  );
};
export default PrivateRoute;