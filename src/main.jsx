import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ApiProvider from "./components/Context/ApiProvider";
import { AuthProvider } from "./components/Context/AuthContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApiProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <App />
          <Toaster position="bottom-right" reverseOrder={true} />
        </AuthProvider>
      </BrowserRouter>
    </ApiProvider>
  </StrictMode>,
);
