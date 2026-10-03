import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

import Layout from "./Components/Layout/Layout";
import ThemeToggle from "./Components/Layout/ThemeToggle";
import LoadingSpinner from "./Components/Common/LoadingSpinner";
import { ErrorBoundary, OfflineBanner } from "./Components/Common/NetworkErrorBoundary";

// Lazy Loaded Pages
const Home = lazy(() => import("./Components/Home/Home"));
const Register = lazy(() => import("./Components/Pages/RegisterPage"));
const Login = lazy(() => import("./Components/Pages/LoginPage"));
const VerifyOTP = lazy(() => import("./Components/Pages/VerifyOTP"));
const ForgotPassword = lazy(() => import("./Components/Pages/ForgotPage"));
const ProfilePage = lazy(() => import("./Components/Pages/ProfilePage"));
const Dashboard = lazy(() => import("./Components/Pages/Dashboard"));
const ChangePassword = lazy(() => import("./Components/Pages/ChangePassword"));
const ResetPassword = lazy(() => import("./Components/Pages/ResetPassword"));
const ResendOtp = lazy(() => import("./Components/Pages/ResendOtp"));
const Tour = lazy(() => import("./Components/Pages/Tour"));
const Birthday = lazy(() => import("./Components/Pages/Birthday"));
const Event = lazy(() => import("./Components/Pages/Event"));
const CorporateParty = lazy(() => import("./Components/Pages/CorporateParty"));
const Notification = lazy(() => import("./Components/Pages/Notification"));
const About = lazy(() => import("./Components/Pages/AboutUs"));
const PrivacyPolicy = lazy(() => import("./Components/Pages/PrivacyPolicy"));
const TermCondition = lazy(() => import("./Components/Pages/TermCondition"));
const Helpdesk = lazy(() => import("./CustomerServices/HelpDesk"));

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  if (token) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      {/* Top Banner when user loses connection */}
      <OfflineBanner />

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            minWidth: "300px",
            maxWidth: "calc(100vw - 32px)",
            padding: "12px 16px",
            borderRadius: "16px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.14)",
          },
        }}
      />

      <ThemeToggle />

      {/* Shows LoadingSpinner while fetching page chunks */}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/tour" element={<ProtectedRoute><Tour /></ProtectedRoute>} />
          <Route path="/tour/:tripId" element={<ProtectedRoute><Tour /></ProtectedRoute>} />
          <Route path="/birthday" element={<ProtectedRoute><Birthday /></ProtectedRoute>} />
          <Route path="/birthday/:birthdayId" element={<ProtectedRoute><Birthday /></ProtectedRoute>} />
          <Route path="/event" element={<ProtectedRoute><Event /></ProtectedRoute>} />
          <Route path="/event/:eventId" element={<ProtectedRoute><Event /></ProtectedRoute>} />
          <Route path="/corporate" element={<ProtectedRoute><CorporateParty /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          <Route path="/resend-otp" element={<PublicRoute><ResendOtp /></PublicRoute>} />
          <Route path="/support" element={<ProtectedRoute><Helpdesk /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermCondition />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;