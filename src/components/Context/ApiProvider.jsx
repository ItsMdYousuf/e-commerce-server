import { createContext, useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

// 1. Create Context
export const ApiContext = createContext(null); // More precise type

// 2. Provider Component
function ApiProvider({ children }) {
  // Added type for children
  const [serverUrl, setServerUrl] = useState("");
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Function to check if the localhost server is running
    const checkLocalhost = async () => {
      try {
        // Use a simple fetch request.  Consider a HEAD request if your backend supports it.
        const response = await fetch("http://localhost:5000", {
          //Added /api/health endpoint
          method: "GET", // Or 'HEAD'
        });
        // Important: Check both response.ok and the actual status code.  400 and 500 range
        //  can sometimes still resolve without throwing an error, but are not "OK".
        if (response.ok && response.status === 200) {
          setServerUrl("http://localhost:5000");
        } else {
          setServerUrl("https://ecommerce-backend-sand-eight.vercel.app");
        }
      } catch (error) {
        // Error means localhost is not running or there was a network issue.
        setServerUrl("https://ecommerce-backend-sand-eight.vercel.app");
      } finally {
        setLoading(false); // Set loading to false after the check
      }
    };

    checkLocalhost();
  }, []);

  // Check if the context is being used correctly.  This is very important
  if (loading) {
    return <LoadingSpinner />; //Or a proper loading indicator
  }

  if (!serverUrl) {
    return (
      <div>
        Error::: ApiProvider must be used within a component that can access
        context.
      </div>
    );
  }

  return (
    <ApiContext.Provider value={{ serverUrl }}>{children}</ApiContext.Provider>
  );
}

export default ApiProvider;
