import React from "react";
import SignupForm from "../components/SignupForm";
import signupImage from "../../../assets/images/signup.png";
import usePageTitle from "../../../core/hooks/usePageTitle";

const SignUp = () => {
  usePageTitle("Sign Up");
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
          <div className="w-full md:w-1/2 p-8 flex justify-center items-center bg-blue-50">
            <img
              src={signupImage}
              alt="Sign up illustration"
              className="max-w-full h-auto object-contain"
            />
          </div>
          <SignupForm />
        </div>
      </div>
      Sign up page
    </>
  );
};

export default SignUp;
