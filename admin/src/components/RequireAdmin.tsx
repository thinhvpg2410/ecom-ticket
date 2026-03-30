import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function RequireAdmin() {
  const { loading, session, profile, profileLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
        Đang tải...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
        Đang tải hồ sơ...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center">
        <p className="text-lg font-semibold text-white">Không có hồ sơ người dùng</p>
        <p className="max-w-md text-sm text-zinc-400">
          Tài khoản chưa có dòng trong <code className="rounded bg-zinc-800 px-1">app_users</code>.
        </p>
        <a className="text-red-500 underline" href="/login">
          Quay lại đăng nhập
        </a>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center">
        <p className="text-lg font-semibold text-white">Không có quyền truy cập</p>
        <p className="max-w-md text-sm text-zinc-400">
          Tài khoản của bạn chưa được gán vai trò <strong>admin</strong> trong bảng{" "}
          <code className="rounded bg-zinc-800 px-1">app_users</code>.
        </p>
        <a className="text-red-500 underline" href="/login">
          Quay lại đăng nhập
        </a>
      </div>
    );
  }

  return <Outlet />;
}
