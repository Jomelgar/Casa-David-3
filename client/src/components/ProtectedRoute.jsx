import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ isAllow, children, redirectTo = "/" }) {
  if (!isAllow) return <Navigate to={redirectTo} />;

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
