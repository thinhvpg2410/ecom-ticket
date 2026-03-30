import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive ? "bg-red-600 text-white" : "text-zinc-300 hover:bg-zinc-800"
  }`;

export default function Layout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className="flex w-56 flex-col border-r border-zinc-800 bg-zinc-900/80">
        <div className="border-b border-zinc-800 px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">ECOM Admin</p>
          <p className="mt-1 truncate text-sm text-white">{profile?.full_name ?? "—"}</p>
          <p className="truncate text-xs text-zinc-500">{profile?.email}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <NavLink to="/" end className={linkClass}>
            Thống kê
          </NavLink>
          <NavLink to="/events" className={linkClass}>
            Sự kiện
          </NavLink>
          <NavLink to="/users" className={linkClass}>
            Người dùng
          </NavLink>
        </nav>
        <div className="border-t border-zinc-800 p-3">
          <button
            type="button"
            onClick={() => void signOut()}
            className="w-full rounded-lg border border-zinc-700 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
