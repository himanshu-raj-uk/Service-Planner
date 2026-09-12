import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";

// ------------------------ User Data ------------------------------->
import Register from "./Components/Pages/RegisterPage";
import Login from "./Components/Pages/LoginPage";
import VerifyOTP from "./Components/Pages/VerifyOTP";
import ForgotPassword from "./Components/Pages/ForgotPage";
import ProfilePage from "./Components/Pages/ProfilePage";
import Dashboard from "./Components/Pages/Dashboard";
import ChangePassword from "./Components/Pages/ChangePassword";
import Tour from "./Components/Pages/Tour";
import Birthday from "./Components/Pages/Birthday";
import Event from "./Components/Pages/Event";
import CorporateParty from "./Components/Pages/CorporateParty";
import Notification from "./Components/Pages/Notification";

// ------------------------ User Support ------------------------------->
import Helpdesk from "./CustomerServices/HelpDesk";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function SuccessToast({ message }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50">
        <CheckCircle2 size={22} strokeWidth={2.5} className="text-indigo-500" />
      </div>

      <span className="text-sm font-semibold text-slate-800">{message}</span>
    </div>
  );
}

function App() {
  return (
    <>
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

          success: {
            icon: null,
          },

          error: {
            style: {
              minWidth: "300px",
              maxWidth: "calc(100vw - 32px)",
              padding: "12px 16px",
              borderRadius: "16px",
              background: "#ffffff",
              border: "1px solid #fecaca",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.14)",
              color: "#0f172a",
            },
          },
        }}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyOTP />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/tour"
          element={
            <ProtectedRoute>
              <Tour />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tour/:tripId"
          element={
            <ProtectedRoute>
              <Tour />
            </ProtectedRoute>
          }
        />

        <Route
          path="/birthday"
          element={
            <ProtectedRoute>
              <Birthday />
            </ProtectedRoute>
          }
        />

        <Route
          path="/birthday/:birthdayId"
          element={
            <ProtectedRoute>
              <Birthday />
            </ProtectedRoute>
          }
        />

        <Route
          path="/event"
          element={
            <ProtectedRoute>
              <Event />
            </ProtectedRoute>
          }
        />

        <Route
          path="/corporate"
          element={
            <ProtectedRoute>
              <CorporateParty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Helpdesk />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
