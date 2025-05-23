import { createContext, useEffect, useState } from "react";

export const ApiContext = createContext(null);

function ApiProvider({ children }) {
  const [serverUrl, setServerUrl] = useState("");

  useEffect(() => {
    const checkLocalhost = async () => {
      try {
        const response = await fetch(
          "https://ecommerce-backend-sand-eight.vercel.app",
        );
        if (response.ok && response) {
          setServerUrl("https://ecommerce-backend-sand-eight.vercel.app");
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
