import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/Users";
import ContentPage from "./pages/Content";
import KYCPage from "./pages/KYC";
import QuickiesPage from "./pages/Quickies";
import ReportsPage from "./pages/Reports";
import GiftsPage from "./pages/Gifts";
import AnalyticsPage from "./pages/Analytics";
import PayoutsPage from "./pages/Payouts";
import FeaturedPage from "./pages/Featured";
import StickersPage from "./pages/Stickers";
import LoginPage from "./pages/Login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="content" element={<ContentPage />} />
                <Route path="quickies" element={<QuickiesPage />} />
                <Route path="kyc" element={<KYCPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="gifts" element={<GiftsPage />} />
                <Route path="featured" element={<FeaturedPage />} />
                <Route path="stickers" element={<StickersPage />} />
                <Route path="payouts" element={<PayoutsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
