import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useAuth } from "../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "../redux/authSlice";
import { forgotPasswordSchema } from "../utils/authValidators";

function ForgotPasswordForm() {
  const { requestPasswordResetLink, isLoading, authError, authSuccessMessage } =
    useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearAuth());
    return () => {
      dispatch(clearAuth());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        await requestPasswordResetLink(values.email);
      } catch (error) {
        console.error("Password reset link request error:", error);
      }
    },
  });
  return (
    <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Forgot Password
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isLoading || !formik.isValid || !formik.dirty}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
            isLoading || !formik.dirty || !formik.isValid
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          } transition duration-150 ease-in-out`}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {authError && (
        <p className="mt-4 text-red-500 text-center text-sm">{authError}</p>
      )}
      {authSuccessMessage && (
        <p className="mt-4 text-green-600 text-center text-sm">
          {authSuccessMessage}
        </p>
      )}
    </div>
  );
}

export default ForgotPasswordForm;
