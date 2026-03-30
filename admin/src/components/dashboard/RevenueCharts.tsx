import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDayLabel, formatVnd } from "../../lib/format";

export type DailyPoint = { day: string; revenue: number; orders: number };
export type ProviderPoint = { provider: string; amount: number; count: number };

const tick = { fill: "#a1a1aa", fontSize: 11 };
const gridStroke = "#27272a";
const tooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: "8px",
  color: "#fafafa",
};

type Props = {
  daily: DailyPoint[];
  byProvider: ProviderPoint[];
};

export default function RevenueCharts({ daily, byProvider }: Props) {
  const lineData = daily.map((p) => ({
    ...p,
    label: formatDayLabel(p.day),
  }));

  const barData = byProvider.map((p) => ({
    ...p,
    label: labelProvider(p.provider),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="flex flex-col rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/80 to-zinc-950/60 p-5 shadow-lg shadow-black/20">
        <header>
          <h2 className="text-base font-bold text-white">Doanh thu theo ngày</h2>
          <p className="mt-0.5 text-xs text-zinc-500">30 ngày gần nhất · đơn đã thanh toán</p>
        </header>
        <div className="mt-4 min-h-[280px] flex-1">
          {lineData.length === 0 ? (
            <p className="flex h-[280px] items-center justify-center text-sm text-zinc-500">Chưa có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineData} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={{ stroke: gridStroke }} />
                <YAxis
                  tick={tick}
                  tickLine={false}
                  axisLine={{ stroke: gridStroke }}
                  tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value ?? 0);
                    if (name === "revenue") {
                      return [formatVnd(n), "Doanh thu"];
                    }
                    return [value ?? 0, "Đơn"];
                  }}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as { day?: string };
                    return row?.day ?? "";
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="flex flex-col rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/80 to-zinc-950/60 p-5 shadow-lg shadow-black/20">
        <header>
          <h2 className="text-base font-bold text-white">Theo kênh thanh toán</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Tổng tiền giao dịch thành công</p>
        </header>
        <div className="mt-4 min-h-[280px] flex-1">
          {barData.length === 0 ? (
            <p className="flex h-[280px] items-center justify-center text-sm text-zinc-500">Chưa có giao dịch</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 12, right: 12, left: 4, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={tick}
                  tickLine={false}
                  axisLine={{ stroke: gridStroke }}
                  interval={0}
                  angle={-14}
                  textAnchor="end"
                  height={48}
                />
                <YAxis
                  tick={tick}
                  tickLine={false}
                  axisLine={{ stroke: gridStroke }}
                  tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value ?? 0);
                    return [formatVnd(n), "Số tiền"];
                  }}
                />
                <Bar dataKey="amount" fill="#dc2626" radius={[6, 6, 0, 0]} name="amount" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>
    </div>
  );
}

function labelProvider(p: string) {
  const map: Record<string, string> = {
    momo: "MoMo",
    visa: "Thẻ",
    vnpay: "VNPay",
  };
  return map[p] ?? p;
}
