import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStatus } from "../hooks/useAuthStatus";

export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return <h3>Loading.....</h3>;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}

// If the user is authenticated (i.e., loggedIn is true), the <Outlet /> component is rendered. The <Outlet /> component is a placeholder provided by React Router that represents the area where the content of the child routes will be rendered. In other words, if the user is authenticated, the <Outlet /> component will display the content of the nested routes.
// On the other hand, if the user is not authenticated (i.e., loggedIn is false), the <Navigate /> component is rendered. The <Navigate /> component is also provided by React Router and is used for programmatic navigation. In this case, it is used to redirect the user to the /sign-in page.
// So, the purpose of the PrivateRoute component is to conditionally render the <Outlet /> component or redirect the user to the sign-in page (/sign-in) based on the loggedIn variable. If the user is logged in, the nested routes will be rendered; otherwise, the user will be redirected to the sign-in page.
