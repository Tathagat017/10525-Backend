import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuspenseLoader from "../components/suspense-loader";
import { Layout } from "../components/layouts/layout";
import { AuthenticatedRoute } from "./authenticated-route";
import { JoinHouseholdPage } from "../pages/protected/join-household-invite";

// Public Pages
const LandingPage = lazy(() => import("../pages/public/landing"));
const LoginPage = lazy(() => import("../pages/public/login"));
const RegisterPage = lazy(() => import("../pages/public/register"));
const NotFoundPage = lazy(() => import("../pages/public/not-found"));

const Dashboard = lazy(() => import("../pages/protected/dashboard"));
const Household = lazy(() => import("../pages/protected/household"));

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Private Routes */}
        <Route
          element={
            <AuthenticatedRoute>
              <Layout />
            </AuthenticatedRoute>
          }
        >
          <Route
            path="/join"
            element={
              <AuthenticatedRoute>
                <JoinHouseholdPage />
              </AuthenticatedRoute>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/households/:id" element={<Household />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
