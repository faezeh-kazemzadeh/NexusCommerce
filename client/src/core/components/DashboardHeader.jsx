import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumbs from "./common/Breadcrumbs";
import UserMenu from "./common/UserMenu";
function DashboardHeader({ toggleSidebar, toggleMobile }) {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoot = location.pathname === "/dashboard";
  const getPageTitle = () => {
    const pathArray = location.pathname.split("/").filter((x) => x);
    const lastPath = pathArray[pathArray.length - 1];

    if (!lastPath || lastPath === "dashboard") return "Overview";

    return (
      lastPath.charAt(0).toUpperCase() + lastPath.slice(1).replace(/-/g, " ")
    );
  };
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-40">
      {/* سمت چپ: ابزارهای کنترلی و لینک‌های سریع */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => {
            toggleSidebar();
            toggleMobile();
          }}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="hidden sm:flex items-center space-x-4">
          <Breadcrumbs />
        </div>
      </div>

      <UserMenu user={currentUser} />
    </header>
  );
}

export default DashboardHeader;
