import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../hooks/useAuth";

import { signInValidationSchema } from "../utils/authValidators";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, authError } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInValidationSchema,
    onSubmit: async (values) => {
      try {
        await login(values);
      } catch (error) {
        console.error("Login error:", error);
      }
    },
  });

  return (
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
        Welcome Back!
      </h2>
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{authError}</span>
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            disabled={isLoading}
            className={`appearance-none relative block w-full px-3 py-2 border ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            {" "}
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            disabled={isLoading}
            className={`appearance-none relative block w-full px-3 py-2 border ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.password}
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
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm mt-4">
          Don’t have an account yet?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500 mb-2 sm:mb-0"
          >
            {" "}
            Sign up here
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row flex-end items-center text-sm mt-4">
          <Link
            to="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500 mb-2 sm:mb-0"
          >
            {" "}
            Reset password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
