import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import {
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineChevronDown,
  HiOutlineBell,
  HiOutlineViewGrid,
} from "react-icons/hi";

function UserMenu({ user }) {
  const { logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const isInDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center h-full gap-2" ref={menuRef}>
      <button className="p-2 text-slate-400 hover:text-blue-600 transition-all relative">
        <HiOutlineBell className="text-xl" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
      </button>

      <div className="relative h-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 px-4 h-full transition-all border-x border-transparent 
          ${isOpen ? "bg-white border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]" : "hover:bg-slate-50"}`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase">
            {user?.firstname?.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold text-slate-700 leading-none">
              {user?.firstname}
            </p>
            <p className="text-[10px] text-slate-400 uppercase font-black mt-1">
              {user?.roles?.[0] || "User"}
            </p>
          </div>
          <HiOutlineChevronDown
            className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          /* تراز دقیق با عرض دکمه بالا و لبه پایین نوبار */
          <div className="absolute right-0 top-full w-full min-w-[200px] z-[110] animate-in fade-in slide-in-from-top-1">
            <div className="bg-white border border-slate-100 border-t-0 rounded-b-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
              {!isInDashboard && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <HiOutlineViewGrid className="text-lg" /> Dashboard
                </Link>
              )}
              <Link
                to="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-4 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <HiOutlineUser className="text-lg text-slate-400" /> My Profile
              </Link>
              <div className="h-px bg-slate-100 mx-5"></div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm text-rose-500 font-semibold hover:bg-rose-50 transition-colors"
              >
                <HiOutlineLogout className="text-lg" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserMenu;
