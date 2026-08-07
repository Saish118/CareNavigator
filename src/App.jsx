import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
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
  );
}

export default App;
