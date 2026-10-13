import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "@/app/page";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { RewardsPage } from "@/features/rewards/pages/RewardsPage";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signin",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/signup",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/rewards",
    element: (
      <DashboardLayout>
        <RewardsPage />
      </DashboardLayout>
    ),
  },
]);
