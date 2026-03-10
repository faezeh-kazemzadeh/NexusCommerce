import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../hooks/useAuth";
import { signUpValidationSchema } from "../utils/authValidators";

const SignupForm = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, authError, isLoading } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUpValidationSchema,
    onSubmit: async (values) => {
      try {
        await register(values);
      } catch (error) {
        console.error("Registration error:", error);
      }
    },
  });

  return (
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
        SignupForm
      </h2>
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{authError}</span>
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstname" className="sr-only">
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
          <label htmlFor="password" className="sr-only">
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
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            disabled={isLoading}
            className={`appearance-none relative block w-full px-3 py-2 border ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.confirmPassword}
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
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
