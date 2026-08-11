import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import { AnalysesProvider } from "./context/AnalysesContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AnalyzerPage from "./pages/AnalyzerPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";

function AppInner() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
        <Route path="/analyzer" element={<ProtectedRoute><AppShell><AnalyzerPage /></AppShell></ProtectedRoute>} />
        <Route path="/results/:id" element={<ProtectedRoute><AppShell><ResultsPage /></AppShell></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><AppShell><HistoryPage /></AppShell></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppShell><ProfilePage /></AppShell></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AnalysesProvider>
        <BrowserRouter>
          <AppInner />
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "#161A1A",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#EFF1EE",
              },
            }}
          />
        </BrowserRouter>
      </AnalysesProvider>
    </AuthProvider>
  );
}
