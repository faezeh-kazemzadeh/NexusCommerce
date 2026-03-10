import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { links } from "../data/links";
import { HiChartPie } from "react-icons/hi";

function NavItem({ link, isCollapsed, setIsMobileOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubLinks = link.subLinks && link.subLinks.length > 0;

  const activeClass = "bg-blue-600 text-white shadow-lg shadow-blue-900/40";
  const inactiveClass =
    "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40";

  const content = (
    <>
      <div className="text-xl min-w-[32px] flex justify-center items-center">
        {link.icon || <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
      </div>
      <span
        className={`whitespace-nowrap overflow-hidden transition-all 
        ${
          isCollapsed
            ? "lg:opacity-0 lg:w-0 lg:group-hover/sidebar:opacity-100 lg:group-hover/sidebar:w-auto lg:duration-75"
            : "opacity-100 w-auto duration-500 lg:delay-200"
        }`}
      >
        {link.name}
      </span>
    </>
  );

  if (!hasSubLinks) {
    return (
      <NavLink
        to={link.url}
        end
        onClick={() => window.innerWidth < 1024 && setIsMobileOpen(false)}
        className={({ isActive }) =>
          `flex items-center p-2.5 text-sm rounded-xl transition-all ${isActive ? activeClass : inactiveClass}`
        }
      >
        {content}
      </NavLink>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-2.5 text-sm rounded-xl transition-all ${inactiveClass}`}
      >
        <div className="flex items-center">{content}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3.5 w-3.5 transition-transform duration-300 
  ${isOpen ? "rotate-180" : ""} 
  block ${isCollapsed ? "lg:hidden lg:group-hover/sidebar:block" : "lg:block"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`ml-4 border-l border-slate-700/50 pl-2 space-y-1 transition-all duration-300
    ${isOpen ? "block opacity-100 max-h-96" : "hidden opacity-0 max-h-0"}
    ${isCollapsed ? "lg:hidden lg:group-hover/sidebar:block" : ""}
  `}
        >
          {link.subLinks.map((sub, idx) => (
            <NavItem
              key={idx}
              link={sub}
              isCollapsed={isCollapsed}
              setIsMobileOpen={setIsMobileOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }) {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userRoles = currentUser?.roles?.flat() || [];

  const filteredLinks = links.filter((category) =>
    category.roles.some((role) => userRoles.includes(role)),
  );

  return (
    <aside
      className={`
        bg-[#343a40] text-slate-300 transition-all duration-300 ease-in-out flex flex-col h-full shrink-0 z-[100] overflow-y-auto
        ${isMobileOpen ? "fixed inset-y-0 left-0 w-64 translate-x-0" : "fixed -translate-x-full lg:translate-x-0"}
        lg:static lg:relative
        ${isCollapsed ? "lg:w-20 lg:hover:w-64 group/sidebar shadow-xl shadow-black/20" : "lg:w-64"}
      `}
    >
      {/* لوگو */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-white shrink-0 overflow-hidden transition-all duration-300">
        <Link to="/" className="flex items-center group/logo">
          <div className="min-w-[32px] h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-md shadow-blue-200 transform transition-transform group-hover/logo:scale-110">
            S
          </div>

          <span
            className={`ml-3 text-xl font-black tracking-tighter text-slate-800 transition-all duration-300 whitespace-nowrap
      ${
        isCollapsed
          ? "lg:opacity-0 lg:w-0 lg:group-hover/sidebar:opacity-100 lg:group-hover/sidebar:ml-3 lg:group-hover/sidebar:w-auto"
          : "opacity-100 w-auto"
      }`}
          >
            MYAPP<span className="text-blue-600">.</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 mt-4 px-3 custom-scrollbar space-y-1">
        <NavItem
          link={{ name: "Dashboard", url: "/dashboard", icon: <HiChartPie /> }}
          isCollapsed={isCollapsed}
          setIsMobileOpen={setIsMobileOpen}
        />

        {filteredLinks.map((category, index) => (
          <div
            key={index}
            className={`${isCollapsed ? "lg:pt-2" : "pt-4"} space-y-1`}
          >
            <div
              className={`px-3 transition-all ${isCollapsed ? "lg:h-0 lg:opacity-0 lg:overflow-hidden lg:group-hover/sidebar:h-auto lg:group-hover/sidebar:opacity-100 lg:group-hover/sidebar:mb-2" : "h-auto opacity-100 mb-2"}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {category.title}
              </span>
            </div>
            <div className="space-y-1">
              {category.links.map((link, idx) => (
                <NavItem
                  key={idx}
                  link={link}
                  isCollapsed={isCollapsed}
                  setIsMobileOpen={setIsMobileOpen}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 shrink-0">
        <button
          onClick={() => window.innerWidth < 1024 && setIsMobileOpen(false)}
          className="w-full p-2.5 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all flex items-center group/btn"
        >
          <div className="text-xl min-w-[24px] flex justify-center group-hover/btn:rotate-12 transition-transform">
            🚪
          </div>
          <span
            className={`ml-3 transition-all ${isCollapsed ? "lg:opacity-0 lg:w-0 lg:group-hover/sidebar:opacity-100 lg:group-hover/sidebar:w-auto" : "opacity-100 w-auto"}`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
