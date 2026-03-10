import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { clearAuth } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { resetPasswordSchema } from "../utils/authValidators";

function ResetPasswordForm({ token }) {
  // const {  } = useParams();
  const { resetUserPassword, isLoading, authError, authSuccessMessage } =
    useAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (authSuccessMessage) {
      const timer = setTimeout(() => {
        dispatch(clearAuth());
        navigate("/signin");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authSuccessMessage, navigate, dispatch]);
  const formik = useFormik({
    initialValues: {
      token,
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        await resetUserPassword(values);
      } catch (error) {
        console.error("Password reset error:", error);
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Reset Your Password
        </h2>
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{authError}</span>
          </div>
        )}
        {authSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Success:</strong>
            <span className="block sm:inline ml-2">{authSuccessMessage}</span>
          </div>
        )}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="sr-only">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              disabled={isLoading}
              className={`appearance-none relative block w-full px-3 py-2 border ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.newPassword}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="sr-only">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmNewPassword}
              disabled={isLoading}
              className={`appearance-none relative block w-full px-3 py-2 border ${
                formik.touched.confirmNewPassword &&
                formik.errors.confirmNewPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {formik.touched.confirmNewPassword &&
            formik.errors.confirmNewPassword ? (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.confirmNewPassword}
              </p>
            ) : null}
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading || !formik.isValid || !formik.dirty}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading || !formik.dirty || !formik.isValid
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              } transition duration-150 ease-in-out`}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
