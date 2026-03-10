import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { clearAuth } from "../redux/authSlice";
import { validateToken } from "../services/authService";
import ResetPasswordForm from "../components/ResetPasswordForm";
// import usePageTitle from "../../core/hooks/usePageTitle";
import usePageTitle from "../../../core/hooks/usePageTitle";
function ResetPasswordPage() {
  usePageTitle("Reset Password");
  const params = useParams();
  const token = params.token;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    dispatch(clearAuth());
    return () => {
      dispatch(clearAuth());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log(token);

    if (!token) {
      setErrorMessage("No token provided.");
      setLoading(false);
      return;
    }
    const checkTokenValidity = async () => {
      console.log("Checking token validity for:", token);
      try {
        const response = await validateToken(token);
        console.log("Token validation response:", response);
        if (response && response.success !== undefined) {
          setIsTokenValid(true);
        }
      } catch (error) {
        const serverMessage =
          error.response?.data?.message || "Invalid or expired token.";
        setErrorMessage(serverMessage);
        console.error("Validation error:", serverMessage);
      } finally {
        setLoading(false);
      }
    };
    checkTokenValidity();
  }, [token, navigate, params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-medium text-gray-700">Validating token...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
          <button
            onClick={() => navigate("/forgot-password")}
            className="ml-4 text-sm underline"
          >
            Request a new token
          </button>
        </div>
      </div>
    );
  }

  if (isTokenValid) {
    return <ResetPasswordForm token={token} />;
  }

  return null;
}

export default ResetPasswordPage;
