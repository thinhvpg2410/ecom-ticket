import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
};

export default function UsersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: rows, error: e } = await supabase
        .from("app_users")
        .select("id, full_name, email, phone, role, status, created_at")
        .order("created_at", { ascending: false });
      if (e) {
        throw e;
      }
      return (rows ?? []) as UserRow[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error: e } = await supabase.from("app_users").delete().eq("id", id);
      if (e) {
        throw e;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  if (isLoading) {
    return <p className="text-zinc-400">Đang tải người dùng...</p>;
  }

  if (error) {
    return (
      <p className="text-red-400">
        {error instanceof Error ? error.message : "Không tải được danh sách."}
      </p>
    );
  }

  const rows = data ?? [];

  return (
    <div>
      <div>
        <h1 className="text-2xl font-black text-white">Người dùng</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Phân quyền (customer / admin / organizer), trạng thái. Tạo tài khoản Auth mới qua Supabase
          Dashboard hoặc API (service role).
        </p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs font-bold uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Điện thoại</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Chưa có người dùng.
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-900/40">
                  <td className="px-4 py-3 font-medium text-white">{u.full_name}</td>
                  <td className="px-4 py-3 text-zinc-300">{u.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{u.phone}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200">
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/users/${u.id}/edit`}
                      className="mr-3 text-sm font-semibold text-red-400 hover:underline"
                    >
                      Sửa
                    </Link>
                    <button
                      type="button"
                      className="text-sm font-semibold text-zinc-500 hover:text-red-400 disabled:opacity-40"
                      disabled={deleteMutation.isPending || u.id === user?.id}
                      title={u.id === user?.id ? "Không xoá chính mình" : undefined}
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Xoá người dùng ${u.email}? Sẽ xoá dữ liệu liên quan (đơn, phương thức thanh toán...) theo cascade.`,
                          )
                        ) {
                          return;
                        }
                        deleteMutation.mutate(u.id, {
                          onError: (err) => {
                            window.alert(err instanceof Error ? err.message : String(err));
                          },
                        });
                      }}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
