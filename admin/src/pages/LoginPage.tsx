import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { session, loading, profileLoading, signIn, isAdmin, profile } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session && profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
        Đang tải hồ sơ...
      </div>
    );
  }

  if (!loading && session && isAdmin) {
    return <Navigate to={from} replace />;
  }

  if (!loading && session && profile && !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center">
        <p className="text-lg font-semibold text-white">Không có quyền admin</p>
        <p className="max-w-md text-sm text-zinc-400">
          Cập nhật <code className="rounded bg-zinc-800 px-1">app_users.role = 'admin'</code> cho user này.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl">
        <h1 className="text-center text-2xl font-black text-white">Admin đăng nhập</h1>
        <p className="mt-2 text-center text-sm text-zinc-400">Supabase Auth + vai trò admin</p>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setSubmitting(true);
            const r = await signIn(email, password);
            setSubmitting(false);
            if (r.error) {
              setError(r.error);
            }
          }}
        >
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-red-500"
              required
            />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-red-600 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
