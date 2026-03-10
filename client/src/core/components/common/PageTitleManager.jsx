import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitleManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const titlesConfig = {
      "/": "Home",
      "/about": "About Us",
      "/signin": "Sign In",
      "/signup": "Create Account",
      "/dashboard": "Admin Panel",
      "/dashboard/profile": "User Profile",
      "/dashboard/users": "Manage Users",
      "/dashboard/orders/my-orders": "My Orders",
      "/dashboard/orders/settings": "Settings",
      "/unauthorized": "Access Denied",
    };

    let title = titlesConfig[pathname];

    if (!title) {
      const segments = pathname.split("/").filter(Boolean);
      const last = [...segments].reverse().find((s) => isNaN(s)) || "Home";

      title = last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }

    document.title = `${title} | My App`;
  }, [pathname]);

  return null;
};

export default PageTitleManager;
