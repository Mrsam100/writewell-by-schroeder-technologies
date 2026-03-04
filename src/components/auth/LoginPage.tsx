/** @license SPDX-License-Identifier: Apache-2.0 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logo } from "../common/Logo";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fcfaf2" }}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo size={48} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm opacity-60">Sign in to your WriteWell account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border bg-white/50 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border bg-white/50 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-black text-white font-mono text-[11px] uppercase tracking-widest font-bold disabled:opacity-30 transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm opacity-60">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 font-medium hover:underline">
            Create one
          </Link>
        </p>
        <p className="text-center text-sm opacity-40">
          <Link to="/app" className="hover:underline">
            Continue without signing in
          </Link>
        </p>
      </div>
    </div>
  );
};
