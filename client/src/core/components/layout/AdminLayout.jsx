import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar.jsx";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100" dir="rtl">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-full">
          <Outlet />
          ؤيءّٔ
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
