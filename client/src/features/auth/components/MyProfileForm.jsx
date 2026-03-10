import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../hooks/useAuth";
import { updateProfileSchema } from "../utils/authValidators";
import { HiOutlineRefresh } from "react-icons/hi";
function MyProfileForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();

  const {
    isAuthenticated,
    authError,
    isLoading,
    updateMyProfile,
    authSuccessMessage,
    currentUser,
    clearAuthMessages,
    profileUpdating,
  } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setDataLoaded(true);
    }
  }, [currentUser]);

  useEffect(() => {
    if (authSuccessMessage) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        clearAuthMessages();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [authSuccessMessage, clearAuthMessages]);

  useEffect(() => {
    if (!isAuthenticated && !currentUser && !isLoading) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate, isLoading, currentUser]);

  const formik = useFormik({
    initialValues: {
      firstname: currentUser?.firstname || "",
      lastname: currentUser?.lastname || "",
      phone: currentUser?.phone || "",
    },
    enableReinitialize: true,
    validationSchema: updateProfileSchema,
    onSubmit: async (values) => {
      await updateMyProfile(values);
    },
  });
  if (!currentUser && isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-blue-600 font-bold">
        <HiOutlineRefresh className="animate-spin mr-2 text-2xl" />
        Loading Profile...
      </div>
    );
  }
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 text-center mb-8">
        Update My Profile
      </h2>
      {authError && (
        <div className="mb-6 p-4 bg-rose-50 border-r-4 border-rose-500 text-rose-700 text-sm rounded-lg">
          {authError}
        </div>
      )}
      {showSuccess && authSuccessMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 text-sm rounded-lg">
          {authSuccessMessage}
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label
            htmlFor="firstname"
            className="text-xs font-bold text-slate-500 ml-1"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="First Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstname}
            disabled={isLoading}
            className={`appearance-none relative block w-full px-3 py-2 border ${
              formik.touched.firstname && formik.errors.firstname
                ? "border-red-500"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formik.touched.firstname && formik.errors.firstname ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.firstname}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lastname" className="sr-only">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Last Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastname}
            disabled={isLoading}
            className={`appearance-none relative block w-full px-3 py-2 border ${
              formik.touched.lastname && formik.errors.lastname
                ? "border-red-500"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formik.touched.lastname && formik.errors.lastname ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.lastname}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="sr-only">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            disabled={isLoading}
            className={`appearance-none relative block w-full px-3 py-2 border ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            disabled={
              profileUpdating || isLoading || !formik.isValid || !formik.dirty
            }
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              profileUpdating || isLoading || !formik.isValid || !formik.dirty
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            } transition duration-150 ease-in-out`}
          >
            {profileUpdating ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyProfileForm;
