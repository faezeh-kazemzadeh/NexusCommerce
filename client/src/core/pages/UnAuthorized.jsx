import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          403 - Forbidden
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          You do not have permission to view this page.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 text-white font-medium bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
