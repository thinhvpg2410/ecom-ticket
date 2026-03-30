import { formatDateTime, formatVnd } from "../../lib/format";

export type LedgerRow = {
  order_id: string;
  paid_at: string | null;
  created_at: string;
  full_name: string;
  email: string;
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
  payment_provider: string | null;
};

type Props = { rows: LedgerRow[] };

export default function RevenueLedgerTable({ rows }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950/40 shadow-lg shadow-black/20">
      <header className="border-b border-zinc-800/90 px-5 py-4">
        <h2 className="text-base font-bold text-white">Bảng kê thu — đơn đã thanh toán</h2>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          Thành tiền, giảm giá, phí, tổng thu và kênh thanh toán (mới nhất trước).
        </p>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-zinc-900/50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Thời điểm TT</th>
              <th className="px-4 py-3">Khách</th>
              <th className="px-4 py-3 text-right">Thành tiền</th>
              <th className="px-4 py-3 text-right">Giảm giá</th>
              <th className="px-4 py-3 text-right">Phí</th>
              <th className="px-4 py-3 text-right text-emerald-400/95">Tổng thu</th>
              <th className="px-4 py-3">Kênh TT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-zinc-500">
                  Chưa có đơn đã thanh toán.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.order_id} className="transition hover:bg-zinc-900/60">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{r.order_id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-400">{formatDateTime(r.paid_at ?? r.created_at)}</td>
                  <td className="max-w-[200px] px-4 py-3">
                    <span className="block truncate font-medium text-zinc-100">{r.full_name}</span>
                    <span className="block truncate text-xs text-zinc-500">{r.email}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-zinc-300">
                    {formatVnd(Number(r.subtotal))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-amber-200/90">
                    {Number(r.discount) > 0 ? `−${formatVnd(Number(r.discount))}` : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-zinc-400">
                    {formatVnd(Number(r.fee))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-base font-semibold tabular-nums text-emerald-300">
                    {formatVnd(Number(r.total))}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{labelProvider(r.payment_provider)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function labelProvider(p: string | null) {
  if (!p) {
    return "—";
  }
  const map: Record<string, string> = {
    momo: "MoMo",
    visa: "Thẻ (Visa/Master)",
    vnpay: "VNPay",
  };
  return map[p] ?? p;
}
