import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import EditUserModal from "../components/EditUserModal";
import { getPagination } from "../../../core/utils/paginationUtils";
const UserManagement = () => {
  const {
    users,
    isLoading,
    currentFilter,
    changeFilter,
    searchTerm,
    page,
    pages,
    limit,
    changeLimit,
    setSearchTerm,
    handleToggleActive,
    handleSystemStatus,
    handleUpdateUser,
    handlePageChange,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const [editSuccess, setEditSuccess] = useState("");
  const [editError, setEditError] = useState("");

  const pagination = getPagination(page, pages);
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans" dir="ltr">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              User Management
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Monitor status and manage system access.
            </p>
          </div>

          <div className="flex bg-gray-200/60 p-1.5 rounded-2xl backdrop-blur-sm border border-gray-200">
            {["active", "inactive", "deleted"].map((status) => (
              <button
                key={status}
                onClick={() => changeFilter(status)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  currentFilter === status
                    ? "bg-white text-blue-600 shadow-lg shadow-blue-100 scale-105"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        {/* Limit Selector */}
        <div className="flex items-center gap-3 mb-6 bg-white w-fit px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-sm font-black text-slate-400 uppercase tracking-wider">
            Show
          </span>
          <select
            value={limit}
            onChange={(e) => changeLimit(e.target.value)}
            className="font-bold text-blue-600 bg-blue-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm font-bold text-slate-500">
            Users per page
          </span>
        </div>
        {/* Users Table */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          {isLoading && users.length === 0 ? (
            <div className="p-20 text-center text-blue-600 font-bold">
              Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase">
                      Full Name
                    </th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase">
                      Email
                    </th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase text-center">
                      Status
                    </th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-blue-50/40 transition-all group"
                    >
                      <td className="px-8 py-6 font-bold text-gray-800">{`${user.firstname} ${user.lastname}`}</td>
                      <td className="px-8 py-6 text-gray-500">{user.email}</td>
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => handleToggleActive(user)}
                          disabled={currentFilter === "deleted"}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            user.active ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.active ? "translate-x-6" : "translate-x-1"}`}
                          />
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right space-x-4">
                        <button
                          disabled={currentFilter === "deleted" || !user.active}
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 font-bold disabled:opacity-30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleSystemStatus(
                              user._id,
                              currentFilter === "deleted"
                                ? "restore"
                                : "delete",
                            )
                          }
                          className={`font-bold ${currentFilter === "deleted" ? "text-green-500" : "text-gray-400 hover:text-red-500"}`}
                        >
                          {currentFilter === "deleted" ? "Restore" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {/* {pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            {Array.from({ length: pages }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
                    page === pageNum
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                      : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        )} */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-3 py-2 rounded-lg border disabled:opacity-40"
            >
              Prev
            </button>

            {pagination.map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${p}-${i}`}
                  onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all
      ${
        page === p
          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
          : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
      }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              disabled={page === pages}
              onClick={() => handlePageChange(page + 1)}
              className="px-3 py-2 rounded-lg border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isLoading={isLoading}
          error={editError}
          successMessage={editSuccess}
          onClose={() => {
            setSelectedUser(null);
            setEditError("");
            setEditSuccess("");
          }}
          onSave={async (id, data) => {
            setEditError("");
            try {
              await handleUpdateUser(id, data);
              setEditSuccess("User updated successfully!");
              setTimeout(() => {
                setSelectedUser(null);
                setEditSuccess("");
              }, 2000);
            } catch (err) {
              setEditError(err || "Update failed");
            }
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
