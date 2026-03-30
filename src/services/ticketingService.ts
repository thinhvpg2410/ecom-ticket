import type { MyTicket } from "../data";
import { supabase } from "../lib/supabase";

type PaymentMethodId = "momo" | "visa" | "vnpay";

type PurchasePayload = {
  userId: string;
  ticketId: string;
  quantity: number;
  method: PaymentMethodId;
  providerLabel: string;
};

type UserTicketRow = {
  id: string;
  order_id: string;
  ticket_id: string;
  issued_at: string;
  status: "valid" | "used" | "expired" | "cancelled";
  events: {
    id: string;
    title: string;
    image_url: string | null;
    date_display: string;
    location: string;
    status: "draft" | "published" | "cancelled" | "ended";
  }[] | null;
};

type OrderItemRow = {
  order_id: string;
  ticket_id: string;
  unit_price: number | string;
};

const ticketBanner = require("../../assets/ticket.png");

function splitDateAndTime(value: string) {
  const parts = value.split(",");
  if (parts.length < 2) {
    return {
      time: value,
      date: value,
    };
  }

  return {
    time: parts[0].trim(),
    date: parts.slice(1).join(",").trim(),
  };
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function toMyTicket(
  row: UserTicketRow,
  user: { fullName: string; email: string; phone: string },
  unitPriceByOrderItem: Map<string, number>,
): MyTicket {
  const event = row.events?.[0] ?? null;
  const dateAndTime = splitDateAndTime(event?.date_display ?? "—");
  const unitPrice = unitPriceByOrderItem.get(`${row.order_id}:${row.ticket_id}`) ?? 0;

  return {
    id: row.id,
    title: event?.title ?? "Sự kiện",
    banner: event?.image_url ? { uri: event.image_url } : ticketBanner,
    ticketPrice: unitPrice,
    buyerName: user.fullName,
    buyerEmail: user.email,
    buyerPhone: user.phone,
    location: event?.location ?? "—",
    date: dateAndTime.date,
    time: dateAndTime.time,
    boughtAt: formatDateTime(row.issued_at),
    status: event?.status === "ended" ? "ended" : "upcoming",
  };
}

export async function purchaseTicket(payload: PurchasePayload) {
  const { data, error } = await supabase.rpc("purchase_ticket", {
    p_user_id: payload.userId,
    p_ticket_id: payload.ticketId,
    p_quantity: payload.quantity,
    p_payment_method_type: payload.method,
    p_payment_provider_label: payload.providerLabel,
  });

  if (error) {
    throw new Error(error.message);
  }

  const first = Array.isArray(data) ? data[0] : null;
  if (!first) {
    throw new Error("Không thể tạo đơn hàng.");
  }

  return {
    orderId: String(first.order_id),
    totalAmount: Number(first.total_amount),
    firstUserTicketId: String(first.first_user_ticket_id),
  };
}

export async function fetchMyTickets(params: {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
}) {
  const { userId, fullName, email, phone } = params;

  const { data: rows, error } = await supabase
    .from("user_tickets")
    .select(
      `
      id,
      order_id,
      ticket_id,
      issued_at,
      status,
      events:event_id (
        id,
        title,
        image_url,
        date_display,
        location,
        status
      )
    `,
    )
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const userTickets = (rows ?? []) as UserTicketRow[];
  if (!userTickets.length) {
    return [];
  }

  const orderIds = Array.from(new Set(userTickets.map((item) => item.order_id)));
  const { data: orderItems, error: orderItemsError } = await supabase
    .from("order_items")
    .select("order_id, ticket_id, unit_price")
    .in("order_id", orderIds);

  if (orderItemsError) {
    throw new Error(orderItemsError.message);
  }

  const unitPriceByOrderItem = new Map<string, number>();
  for (const item of (orderItems ?? []) as OrderItemRow[]) {
    unitPriceByOrderItem.set(`${item.order_id}:${item.ticket_id}`, Number(item.unit_price));
  }

  return userTickets.map((row) =>
    toMyTicket(row, { fullName, email, phone }, unitPriceByOrderItem),
  );
}
