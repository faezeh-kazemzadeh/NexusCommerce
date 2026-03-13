import { useEffect } from "react";

import "./App.css";

import { setBaseURL } from "./core/services/apiClient";

import AppRouter from "./core/router/AppRouter";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      refetchOnReconnect: true, // Refetch when the browser regains network connection
      refetchOnWindowFocus: false, // Prevents auto-refetching when you switch tabs
    },
  },
});

function App() {
  useEffect(() => {
    const API_BASE_URL = "/api";
    setBaseURL(API_BASE_URL);
    console.log(`Axios Base URL set to: ${API_BASE_URL}`);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
