import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import UserMenu from "./common/UserMenu";

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isArticlesOpen, setIsArticlesOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setIsArticlesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      ref={navRef}
      className="bg-white border-b border-slate-200 h-16 sticky top-0 z-[100] shadow-sm"
    >
      <div className="mx-auto flex justify-between items-center h-full px-6">
        {/* سمت چپ: برند و لینک‌ها */}
        <div className="flex items-center space-x-8 h-full">
          <Link
            to="/"
            className="text-xl font-black tracking-tighter text-blue-600"
          >
            MYAPP<span className="text-slate-800">.</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm font-semibold h-full">
            <Link
              to="/products"
              className="text-slate-500 hover:text-blue-600 transition-colors h-full flex items-center"
            >
              Products
            </Link>

            {/* دراپ‌دان Articles */}
            <div className="relative h-full flex items-center">
              <button
                onClick={() => setIsArticlesOpen(!isArticlesOpen)}
                className={`flex items-center gap-1 transition-colors h-full ${isArticlesOpen ? "text-blue-600" : "text-slate-500 hover:text-blue-600"}`}
              >
                Articles{" "}
                <FaChevronDown
                  size={10}
                  className={`transition-transform duration-200 ${isArticlesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isArticlesOpen && (
                /* تراز دقیق با لبه پایین نوبار */
                <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 rounded-b-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-1">
                  <Link
                    to="/articles/category-1"
                    className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  >
                    Category 1
                  </Link>
                  <Link
                    to="/articles/all"
                    className="block px-4 py-2 text-blue-600 font-bold hover:bg-slate-50"
                  >
                    All Articles
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="text-slate-500 hover:text-blue-600 transition-colors h-full flex items-center"
            >
              About Us
            </Link>
          </div>
        </div>

        {/* سمت راست: پروفایل و موبایل */}
        <div className="flex items-center gap-4 h-full">
          {isAuthenticated ? (
            <div className="hidden md:block h-full">
              <UserMenu user={currentUser} />
            </div>
          ) : (
            <Link
              to="/signin"
              className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-100"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* منوی موبایل  */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900 z-[150] p-6 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-10">
            <span className="text-xl font-black text-blue-500">MYAPP.</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-400 p-2 hover:text-white"
            >
              <FaTimes size={28} />
            </button>
          </div>

          <div className="flex flex-col space-y-6">
            <Link to="/products" className="text-xl text-slate-300 font-medium">
              Products
            </Link>

            <div>
              <button
                onClick={() => setIsArticlesOpen(!isArticlesOpen)}
                className="flex justify-between items-center w-full text-xl text-slate-300"
              >
                Articles{" "}
                <FaChevronDown
                  size={16}
                  className={isArticlesOpen ? "rotate-180" : ""}
                />
              </button>
              {isArticlesOpen && (
                <div className="mt-4 ml-4 space-y-4 border-l border-slate-700 pl-4 animate-in fade-in duration-300">
                  <Link
                    to="/articles/all"
                    className="block text-blue-400 text-lg"
                  >
                    All Articles
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about" className="text-xl text-slate-300 font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-xl text-slate-300 font-medium">
              Contact
            </Link>

            <div className="h-px bg-slate-800 w-full my-4"></div>

            {isAuthenticated ? (
              <div className="flex flex-col space-y-6">
                <Link
                  to="/dashboard/profile"
                  className="text-xl text-slate-300 font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="text-xl text-slate-300 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xl text-rose-500 font-bold text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/signin" className="text-xl text-blue-500 font-bold">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
