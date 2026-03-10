import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";

function AllowedRolesWrapper({ allowedRoles }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const userRoles = currentUser?.roles || [];
  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  if (hasAccess) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
}

export default AllowedRolesWrapper;
