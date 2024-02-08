import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Session from "supertokens-web-js/recipe/session";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const checkSession = async () => {
    let isAuthenticated = await Session.doesSessionExist();
    if (isAuthenticated) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);
  return isAuthenticated;
};

function PrivateRoute() {
  const location = useLocation();
  const isAuth = useAuth();
  if (isAuth == null) {
    return null;
  }

  return isAuth ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to={"/overview"} replace state={{ from: location }} />
  );
}

export default PrivateRoute;
