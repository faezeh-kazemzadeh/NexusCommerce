import React from "react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import usePageTitle from "../../../core/hooks/usePageTitle";


function ForgotPassword() {
  usePageTitle("Forgot Password");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ForgotPasswordForm />
    </div>
  );
}

export default ForgotPassword;
