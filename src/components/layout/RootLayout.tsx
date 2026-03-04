/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { AuthProvider } from "../../contexts/AuthContext";
import { ErrorBoundary } from "../common/ErrorBoundary";

export const RootLayout = () => {
  const location = useLocation();
  const isApp = location.pathname.startsWith("/app");

  return (
    <ErrorBoundary>
    <AuthProvider>
      <div className="min-h-screen font-sans antialiased selection:bg-blue-100 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isApp ? "app" : "landing"}
            initial={{ opacity: 0, ...(isApp ? { scale: 0.98 } : {}) }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, ...(isApp ? {} : { y: -50 }) }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthProvider>
    </ErrorBoundary>
  );
};
