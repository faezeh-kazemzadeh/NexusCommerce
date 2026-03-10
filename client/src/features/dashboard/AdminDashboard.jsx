import React from "react";
const stats = [
  {
    id: 1,
    name: "Total Users",
    value: "1,240",
    change: "+12%",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Active Projects",
    value: "45",
    change: "+5%",
    color: "bg-emerald-500",
  },
  {
    id: 3,
    name: "Pending Tasks",
    value: "12",
    change: "-2%",
    color: "bg-amber-500",
  },
  {
    id: 4,
    name: "Total Revenue",
    value: "$12,400",
    change: "+18%",
    color: "bg-violet-500",
  },
];
function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
        <p className="text-slate-500">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* شبکه کارت‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white shadow-lg`}
              >
                {/* می‌توانید اینجا آیکون بگذارید */}
                <span className="text-xl">📊</span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* بخش نمونه برای نمایش جدول یا محتوای بیشتر */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-64 flex items-center justify-center border-dashed border-2">
        <p className="text-slate-400">
          Main Content Chart or Table Placeholder
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
