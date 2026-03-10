import { useState } from "react";
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../DashboardHeader";
import Breadcrumbs from "../common/Breadcrumbs";
function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="flex h-screen w-full bg-[#f4f6f9] overflow-hidden"
      dir="ltr"
    >
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <DashboardHeader
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
          toggleMobile={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#f4f6f9] custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center ">
              {/* <h1 className="text-2xl font-bold text-slate-800">Page Title</h1> */}
              {/* <Breadcrumbs /> */}
            </div>
            <Outlet />
          </div>
        </main>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
