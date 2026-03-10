import React from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

function Dashboard() {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();
  const userRoles = currentUser?.roles || [];

  if (isLoading) {
    return <div>Loading Dashboard...</div>;
  }

  const isIndexPage =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  if (!isIndexPage) {
    return <Outlet />;
  }

  const hasRole = (role) => userRoles.includes(role);

  if (hasRole("admin")) return <AdminDashboard />;

  if (hasRole("user")) return <UserDashboard />;

  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
      <p className="text-slate-500">
        You don't have a valid role to view this dashboard.
      </p>
    </div>
  );
}

export default Dashboard;
