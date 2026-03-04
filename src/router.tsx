/** @license SPDX-License-Identifier: Apache-2.0 */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import { LandingPage } from "./components/landing/LandingPage";
import { AppView } from "./components/app/AppView";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/app", element: <AppView /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
