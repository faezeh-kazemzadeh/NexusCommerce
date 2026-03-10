import { useLocation, Link } from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-slate-500">
        <li>
          <Link
            to="/dashboard"
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
        </li>

        {pathnames.map((value, index) => {
          if (value.toLowerCase() === "dashboard") return null;

          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const breadcrumbName =
            value.replace(/-/g, " ").charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={to} className="flex items-center space-x-2">
              <span className="text-slate-400">/</span>

              {isLast ? (
                <span
                  className="font-semibold text-slate-800"
                  aria-current="page"
                >
                  {breadcrumbName}
                </span>
              ) : (
                <Link to={to} className="hover:text-blue-600 transition-colors">
                  {breadcrumbName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
