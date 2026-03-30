import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { supabase } from "../lib/supabase";

type EventRow = {
  id: string;
  title: string;
  date_display: string;
  status: string;
  organizer_id: string;
  created_at: string;
};

export default function EventsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data: events, error: e1 } = await supabase
        .from("events")
        .select("id, title, date_display, status, organizer_id, created_at")
        .order("created_at", { ascending: false });
      if (e1) {
        throw e1;
      }
      const { data: orgs, error: e2 } = await supabase.from("organizers").select("id, name");
      if (e2) {
        throw e2;
      }
      const orgMap = new Map((orgs ?? []).map((o) => [o.id, o.name]));
      return { events: (events ?? []) as EventRow[], orgMap };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error: e } = await supabase.from("events").delete().eq("id", id);
      if (e) {
        throw e;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  if (isLoading) {
    return <p className="text-zinc-400">Đang tải sự kiện...</p>;
  }

  if (error) {
    return (
      <p className="text-red-400">
        {error instanceof Error ? error.message : "Không tải được danh sách sự kiện."}
      </p>
    );
  }

  const rows = data?.events ?? [];
  const orgMap = data?.orgMap ?? new Map<string, string>();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Sự kiện</h1>
          <p className="mt-1 text-sm text-zinc-400">Tạo, sửa và xoá sự kiện cùng loại vé.</p>
        </div>
        <Link
          to="/events/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
        >
          + Thêm sự kiện
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs font-bold uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3">Ngày hiển thị</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ban tổ chức</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Chưa có sự kiện.{" "}
                  <Link className="text-red-400 underline" to="/events/new">
                    Thêm mới
                  </Link>
                </td>
              </tr>
            ) : (
              rows.map((ev) => (
                <tr key={ev.id} className="hover:bg-zinc-900/40">
                  <td className="px-4 py-3 font-medium text-white">{ev.title}</td>
                  <td className="px-4 py-3 text-zinc-300">{ev.date_display}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200">
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{orgMap.get(ev.organizer_id) ?? ev.organizer_id}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/events/${ev.id}/edit`}
                      className="mr-3 text-sm font-semibold text-red-400 hover:underline"
                    >
                      Sửa
                    </Link>
                    <button
                      type="button"
                      className="text-sm font-semibold text-zinc-500 hover:text-red-400"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Xoá sự kiện "${ev.title}"? Không thể xoá nếu đã có đơn hàng liên quan.`,
                          )
                        ) {
                          return;
                        }
                        deleteMutation.mutate(ev.id, {
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
