import React from "react";
import LoginForm from "../components/LoginForm";
import signinImage from "../../../assets/images/signin.png";
import usePageTitle from "../../../core/hooks/usePageTitle";


function SignIn() {
  usePageTitle("Sign In");
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
          <div className="w-full md:w-1/2 p-8 flex justify-center items-center bg-blue-50">
            <img
              src={signinImage}
              alt="Sign in illustration"
              className="max-w-full h-auto object-contain"
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
}

export default SignIn;
