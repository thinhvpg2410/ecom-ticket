export function formatVnd(n: number) {
  return `${Math.round(n).toLocaleString("vi-VN")} đ`;
}

/** `YYYY-MM-DD` → hiển thị ngắn */
export function formatDayLabel(isoDay: string) {
  const [y, m, d] = isoDay.split("-").map(Number);
  if (!y || !m || !d) {
    return isoDay;
  }
  return new Date(y, m - 1, d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatDateTime(iso: string | null) {
  if (!iso) {
    return "—";
  }
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) {
    return "—";
  }
  return t.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
