import React, { useState } from "react";

const EditUserModal = ({
  user,
  onClose,
  onSave,
  isLoading,
  error,
  successMessage,
}) => {
  const [formData, setFormData] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    roles: user.roles || [],
  });

  const availableRoles = ["user", "admin", "editor"];

  const handleRoleChange = (role) => {
    const updatedRoles = formData.roles.includes(role)
      ? formData.roles.filter((r) => r !== role)
      : [...formData.roles, role];
    setFormData({ ...formData, roles: updatedRoles });
  };

  // بستن مودال با کلیک روی پس‌زمینه
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-black text-slate-800 text-center mb-8">
          Edit User Profile
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-r-4 border-rose-500 text-rose-700 text-sm rounded-xl font-bold">
            {typeof error === "string"
              ? error
              : error.message || JSON.stringify(error)}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 text-sm rounded-xl font-bold">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(user._id, formData);
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
              disabled={isLoading || !!successMessage}
              placeholder="First Name"
            />
            <input
              className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
              disabled={isLoading || !!successMessage}
              placeholder="Last Name"
            />
          </div>

          <input
            className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isLoading || !!successMessage}
            placeholder="Email Address"
          />

          <div className="flex flex-wrap gap-2">
            {availableRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                disabled={isLoading || !!successMessage}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase border transition-all ${
                  formData.roles.includes(role)
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-10">
            {!successMessage ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-2.5 bg-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-200"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <div className="text-emerald-500 font-black animate-bounce">
                Profile Updated!
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
