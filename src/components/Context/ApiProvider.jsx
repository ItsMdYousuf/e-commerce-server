import { createContext, useEffect, useState } from "react";

export const ApiContext = createContext(null);

function ApiProvider({ children }) {
  const [serverUrl, setServerUrl] = useState("");

  useEffect(() => {
    const checkLocalhost = async () => {
      try {
        const response = await fetch("http://localhost:5000");
        if (response.ok && response) {
          setServerUrl("http://localhost:5000");
        } else {
          setServerUrl("https://ecommerce-backend-sand-eight.vercel.app");
        }
      } catch (error) {
        setServerUrl("https://ecommerce-backend-sand-eight.vercel.app");
      }
    };

    checkLocalhost();
  }, []);

  return (
    <ApiContext.Provider value={{ serverUrl }}>{children}</ApiContext.Provider>
  );
}

export default ApiProvider;
