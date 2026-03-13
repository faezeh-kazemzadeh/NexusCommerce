import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import PublicRoutesLayout from "../components/layout/PublicRoutesLayout";
import PrivateRoutesLayout from "../components/layout/PrivateRoutesLayout";
import AllowedRolesWrapper from "../components/common/AllowedRolesWrapper";
import DashboardLayout from "../components/layout/DashboardLayout";
import UserLayout from "../components/layout/UserLayout";
import PageTitleManager from "../components/common/PageTitleManager";

/* -------------------- Lazy Pages -------------------- */

const Home = lazy(() => import("../../pages/Home"));
const About = lazy(() => import("../../pages/About"));
const UnAuthorized = lazy(() => import("../../pages/UnAuthorized"));
const NotFound = lazy(() => import("../../pages/NotFound"));

const SignIn = lazy(() => import("../../features/auth/pages/SignIn"));
const SignUp = lazy(() => import("../../features/auth/pages/SignUp"));
const ForgotPassword = lazy(
  () => import("../../features/auth/pages/ForgotPassword"),
);
const ResetPassword = lazy(
  () => import("../../features/auth/pages/ResetPassword"),
);
const MyProfile = lazy(() => import("../../features/auth/pages/MyProfile"));

const Dashboard = lazy(() => import("../../features/dashboard/Dashboard"));

const UserManagement = lazy(
  () => import("../../features/users/pages/UserManagement"),
);

const Tags = lazy(() => import("../../features/tags/pages/Tags"));
/* -------------------- Router -------------------- */

function AppRouter() {
  return (
    <Router>
      <PageTitleManager />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
            Loading page...
          </div>
        }
      >
        <Routes>
          {/* ---------------- Public Pages ---------------- */}

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="unauthorized" element={<UnAuthorized />} />

            <Route element={<PublicRoutesLayout />}>
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
            </Route>
          </Route>

          {/* ---------------- Private Routes ---------------- */}

          <Route element={<PrivateRoutesLayout />}>
            <Route
              element={<AllowedRolesWrapper allowedRoles={["admin", "user"]} />}
            >
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route element={<Dashboard />}>
                  <Route index element={null} />

                  <Route path="profile" element={<MyProfile />} />
                  {/* ---------- Admin Routes ---------- */}

                  <Route
                    element={<AllowedRolesWrapper allowedRoles={["admin"]} />}
                  >
                    <Route path="users">
                      <Route index element={<UserManagement />} />
                      <Route path=":id" element={<div>User Detail</div>} />
                    </Route>
                    <Route path="tags" element={<Tags />} />
                  </Route>

                  {/* ---------- User Routes ---------- */}

                  <Route
                    element={<AllowedRolesWrapper allowedRoles={["user"]} />}
                  >
                    <Route element={<UserLayout />}>
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

          {/* ---------------- Misc ---------------- */}

          <Route path="redirect" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRouter;
