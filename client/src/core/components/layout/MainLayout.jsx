import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import Header from "../Header";
import Footer from "../Footer";

function MainLayout() {
  const { clearAuthMessages } = useAuth();
  const location = useLocation();

  // بخش تایتل کلاً حذف شد چون PageTitleManager این کار را انجام می‌دهد

  useEffect(() => {
    clearAuthMessages();
    return () => {
      clearAuthMessages();
    };
  }, [location.pathname, clearAuthMessages]);

  return (
    <>
      <Header />
      <main>
        {" "}
        {/* بهتر است محتوا را در تگ main بگذاری */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
