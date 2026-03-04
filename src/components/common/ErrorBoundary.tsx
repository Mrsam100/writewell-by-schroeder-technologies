/** @license SPDX-License-Identifier: Apache-2.0 */
import { Component, type ReactNode } from "react";
import { Logo } from "./Logo";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fcfaf2" }}>
          <div className="text-center max-w-md space-y-6">
            <Logo size={64} className="mx-auto" />
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-sm opacity-60">
              An unexpected error occurred. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-full bg-black text-white font-mono text-[11px] uppercase tracking-widest font-bold"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
