import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EmergencyProvider } from "./context/EmergencyContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { ToastProvider } from "./components/ui/ToastNotification";
import { AppRoutes } from "./routes/appRoutes";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export function App() {
  return (
    <AuthProvider>
      <EmergencyProvider>
        <BookmarkProvider>
          <ToastProvider>
            <BrowserRouter>
              <ScrollToTop />
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </BookmarkProvider>
      </EmergencyProvider>
    </AuthProvider>
  );
}

export default App;
