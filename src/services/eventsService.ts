import { events as fallbackEvents, type EventItem, type Ticket } from "../data";
import { supabase } from "../lib/supabase";

type EventRow = {
  id: string;
  title: string;
  image_url: string | null;
  date_display: string;
  category: EventItem["category"];
  is_trending: boolean;
  location: EventItem["location"];
  type: EventItem["type"];
  description: string;
  organizers: {
    name: string;
    logo_url: string | null;
  }[] | null;
  event_tickets: TicketRow[] | null;
};

type TicketRow = {
    id: string;
    name: string;
    price: number | string;
    remaining: number;
    benefits: string[] | null;
};

const defaultTicketLogo = require("../../assets/ticket.png");

function toTicket(raw: TicketRow): Ticket {
  return {
    id: raw.id,
    name: raw.name,
    price: Number(raw.price),
    remaining: raw.remaining,
    benefits: raw.benefits ?? undefined,
  };
}

function toEventItem(row: EventRow): EventItem {
  const organizer = row.organizers?.[0];

  return {
    id: row.id,
    title: row.title,
    image: row.image_url ? { uri: row.image_url } : defaultTicketLogo,
    date: row.date_display,
    category: row.category,
    isTrending: row.is_trending,
    location: row.location,
    type: row.type,
    description: row.description,
    organizer: {
      name: organizer?.name ?? "Đơn vị tổ chức",
      logo: organizer?.logo_url ? { uri: organizer.logo_url } : defaultTicketLogo,
    },
    tickets: (row.event_tickets ?? []).map(toTicket),
  };
}

export async function fetchEvents(): Promise<EventItem[]> {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      image_url,
      date_display,
      category,
      is_trending,
      location,
      type,
      description,
      organizers:organizer_id (
        name,
        logo_url
      ),
      event_tickets (
        id,
        name,
        price,
        remaining,
        benefits
      )
    `,
    )
    .eq("status", "published")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as EventRow[];
  if (!rows.length) {
    return fallbackEvents;
  }

  return rows.map(toEventItem);
}
