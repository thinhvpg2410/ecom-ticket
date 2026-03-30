import { useQuery } from "@tanstack/react-query";

import RevenueCharts from "../components/dashboard/RevenueCharts";
import type { DailyPoint, ProviderPoint } from "../components/dashboard/RevenueCharts";
import RevenueLedgerTable, { type LedgerRow } from "../components/dashboard/RevenueLedgerTable";
import { formatSupabaseError } from "../lib/errors";
import { formatVnd } from "../lib/format";
import { supabase } from "../lib/supabase";

type Stats = {
  total_revenue: number;
  tickets_sold: number;
  seats_sold: number;
  orders_paid: number;
};

type Breakdown = {
  gross_subtotal: number;
  total_discount: number;
  total_fee: number;
  net_total: number;
  orders_paid: number;
};

type DashboardData = {
  stats: Stats;
  breakdown: Breakdown;
  daily: DailyPoint[];
  byProvider: ProviderPoint[];
  ledger: LedgerRow[];
};

async function fetchDashboard(): Promise<DashboardData> {
  const [statsRes, breakdownRes, seriesRes, providerRes, ledgerRes] = await Promise.all([
    supabase.rpc("admin_dashboard_stats"),
    supabase.rpc("admin_revenue_breakdown"),
    supabase.rpc("admin_revenue_daily_series", { p_days: 30 }),
    supabase.rpc("admin_revenue_by_provider"),
    supabase.rpc("admin_orders_ledger", { p_limit: 100 }),
  ]);

  const checks: { name: string; error: typeof statsRes.error }[] = [
    { name: "admin_dashboard_stats", error: statsRes.error },
    { name: "admin_revenue_breakdown", error: breakdownRes.error },
    { name: "admin_revenue_daily_series", error: seriesRes.error },
    { name: "admin_revenue_by_provider", error: providerRes.error },
    { name: "admin_orders_ledger", error: ledgerRes.error },
  ];
  const failed = checks.find((c) => c.error);
  if (failed?.error) {
    throw new Error(`${failed.name}: ${formatSupabaseError(failed.error)}`);
  }

  return {
    stats: statsRes.data as Stats,
    breakdown: breakdownRes.data as Breakdown,
    daily: (seriesRes.data ?? []) as DailyPoint[],
    byProvider: (providerRes.data ?? []) as ProviderPoint[],
    ledger: (ledgerRes.data ?? []) as LedgerRow[],
  };
}

export default function DashboardPage() {
  const { data, isLoading, error, isRefetching, refetch } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchDashboard,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-red-100">
        <p className="text-lg font-semibold">Không tải được dashboard</p>
        <p className="mt-2 whitespace-pre-wrap break-words font-mono text-sm text-red-200/90">
          {formatSupabaseError(error)}
        </p>
        <p className="mt-4 text-xs leading-relaxed text-zinc-400">
          Kiểm tra đã chạy migrations{" "}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-200">20260331_admin_rls.sql</code> và{" "}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-200">20260401_admin_dashboard_charts.sql</code>{" "}
          trên Supabase; tài khoản cần <code className="text-zinc-300">role = admin</code> trong{" "}
          <code className="text-zinc-300">app_users</code>.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-8 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const stats = data!.stats;
  const breakdown = data!.breakdown;

  return (
    <div className="space-y-10 pb-8">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-zinc-800/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-500/90">Tổng quan</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Dashboard</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            Doanh thu, vé đã bán, biểu đồ theo thời gian và bảng kê đơn đã thanh toán.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isRefetching}
          className="shrink-0 self-start rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 sm:self-auto"
        >
          {isRefetching ? "Đang làm mới…" : "Làm mới dữ liệu"}
        </button>
      </header>

      {/* KPI */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          Chỉ số chính
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Doanh thu (đã TT)"
            value={formatVnd(Number(stats.total_revenue ?? 0))}
            hint="Tổng tiền đơn paid"
            accent="rose"
          />
          <KpiCard label="Đơn đã thanh toán" value={String(stats.orders_paid ?? 0)} hint="Số đơn" />
          <KpiCard label="Vé đã phát hành" value={String(stats.tickets_sold ?? 0)} hint="user_tickets" />
          <KpiCard label="Ghế / vé bán" value={String(stats.seats_sold ?? 0)} hint="Từ order_items paid" />
        </div>
      </section>

      {/* Thu chi */}
      <section aria-labelledby="finance-heading">
        <div className="mb-4">
          <h2 id="finance-heading" className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Thu chi doanh thu
          </h2>
          <p className="mt-1 text-xs text-zinc-600">Tổng hợp trên toàn bộ đơn trạng thái paid.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            label="Thành tiền hàng"
            value={formatVnd(Number(breakdown.gross_subtotal ?? 0))}
            hint="Subtotal"
            compact
          />
          <KpiCard
            label="Giảm giá"
            value={
              Number(breakdown.total_discount ?? 0) > 0
                ? `−${formatVnd(Number(breakdown.total_discount))}`
                : formatVnd(0)
            }
            hint="Chiết khấu"
            compact
            valueClass="text-amber-200"
          />
          <KpiCard label="Phí" value={formatVnd(Number(breakdown.total_fee ?? 0))} hint="Fee" compact />
          <KpiCard
            label="Tổng thu"
            value={formatVnd(Number(breakdown.net_total ?? 0))}
            hint="Total"
            compact
            accent="emerald"
          />
          <KpiCard label="Số đơn" value={String(breakdown.orders_paid ?? 0)} hint="Paid" compact />
        </div>
      </section>

      {/* Charts */}
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="sr-only">
          Biểu đồ
        </h2>
        <RevenueCharts daily={data!.daily} byProvider={data!.byProvider} />
      </section>

      {/* Ledger */}
      <section aria-labelledby="ledger-heading">
        <h2 id="ledger-heading" className="sr-only">
          Bảng kê đơn hàng
        </h2>
        <RevenueLedgerTable rows={data!.ledger} />
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  accent,
  compact,
  valueClass,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "rose" | "emerald";
  compact?: boolean;
  valueClass?: string;
}) {
  const ring =
    accent === "rose"
      ? "ring-1 ring-red-500/25"
      : accent === "emerald"
        ? "ring-1 ring-emerald-500/30"
        : "ring-1 ring-zinc-800/80";

  const valueTone =
    valueClass ??
    (accent === "emerald" ? "text-emerald-300" : accent === "rose" ? "text-red-100" : "text-white");

  return (
    <div
      className={`rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 p-5 ${ring} ${compact ? "p-4" : ""}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-2 font-black tabular-nums tracking-tight ${compact ? "text-xl" : "text-2xl"} ${valueTone}`}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-zinc-600">{hint}</p> : null}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      <div className="h-24 rounded-2xl bg-zinc-900/80" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-zinc-900/80" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-zinc-900/80" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[320px] rounded-2xl bg-zinc-900/80" />
        <div className="h-[320px] rounded-2xl bg-zinc-900/80" />
      </div>
      <div className="h-64 rounded-2xl bg-zinc-900/80" />
    </div>
  );
}
