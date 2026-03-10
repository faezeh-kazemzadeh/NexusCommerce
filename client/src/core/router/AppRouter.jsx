import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { About, Home, UnAuthorized, NotFound } from "../pages";
import MainLayout from "../components/layout/MainLayout";
import PublicRoutesLayout from "../components/layout/PublicRoutesLayout";
import PrivateRoutesLayout from "../components/layout/PrivateRoutesLayout";
import AllowedRolesWrapper from "../components/common/AllowedRolesWrapper";
import SignIn from "../../features/auth/pages/SignIn";
import SignUp from "../../features/auth/pages/SignUp";
import ForgotPassword from "../../features/auth/pages/ForgotPassword";
import ResetPassword from "../../features/auth/pages/ResetPassword";
import MyProfile from "../../features/auth/pages/MyProfile";
import Dashboard from "../../features/dashboard/Dashboard";
import AdminLayout from "../components/layout/AdminLayout";
import UserLayout from "../components/layout/UserLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageTitleManager from "../components/common/PageTitleManager";
import UserManagement from "../../features/users/pages/UserManagement";

function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <PageTitleManager />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="unauthorized" element={<UnAuthorized />} />
            <Route path="about" element={<About />} />

            <Route element={<PublicRoutesLayout />}>
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
            </Route>
          </Route>

          <Route element={<PrivateRoutesLayout />}>
            {/* Add private routes here */}
            <Route
              element={<AllowedRolesWrapper allowedRoles={["admin", "user"]} />}
            >
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route element={<Dashboard />}>
                  <Route index element={null} />
                  <Route path="profile" element={<MyProfile />} />

                  <Route
                    element={<AllowedRolesWrapper allowedRoles={["admin"]} />}
                  >
                    <Route path="users">
                      <Route index element={<UserManagement />} />
                      <Route path=":id" element={<div>User Detail</div>} />
                    </Route>
                  </Route>
                  <Route
                    element={<AllowedRolesWrapper allowedRoles={["user"]} />}
                  >
                    <Route element={<UserLayout />}>
                      {/* Add user-specific routes here */}
                      <Route path="orders">
                        <Route
                          path="my-orders"
                          element={<div>Orders List</div>}
                        />
                        <Route
                          path="settings"
                          element={<div>Settings Page</div>}
                        />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          {/* Add other routes here */}
          <Route path="*" element={<NotFound />} />
          <Route path="redirect" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRouter;
