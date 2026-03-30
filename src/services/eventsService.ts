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
  organizer_id: string | null;
};

type TicketRow = {
  id: string;
  event_id: string;
  name: string;
  price: number | string;
  remaining: number;
  benefits: string[] | null;
};

type OrganizerRow = {
  id: string;
  name: string;
  logo_url: string | null;
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
      name: "Đơn vị tổ chức",
      logo: defaultTicketLogo,
    },
    tickets: [],
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
      organizer_id
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

  const organizerIds = Array.from(
    new Set(rows.map((row) => row.organizer_id).filter((id): id is string => !!id)),
  );
  const eventIds = rows.map((row) => row.id);

  const [organizersResult, ticketsResult] = await Promise.all([
    organizerIds.length
      ? supabase.from("organizers").select("id, name, logo_url").in("id", organizerIds)
      : Promise.resolve({ data: [], error: null }),
    eventIds.length
      ? supabase
          .from("event_tickets")
          .select("id, event_id, name, price, remaining, benefits")
          .in("event_id", eventIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (organizersResult.error) {
    throw organizersResult.error;
  }
  if (ticketsResult.error) {
    throw ticketsResult.error;
  }

  const organizerById = new Map<string, OrganizerRow>();
  for (const item of (organizersResult.data ?? []) as OrganizerRow[]) {
    organizerById.set(item.id, item);
  }

  const ticketsByEventId = new Map<string, TicketRow[]>();
  for (const item of (ticketsResult.data ?? []) as TicketRow[]) {
    const list = ticketsByEventId.get(item.event_id) ?? [];
    list.push(item);
    ticketsByEventId.set(item.event_id, list);
  }

  return rows.map((row) => {
    const base = toEventItem(row);
    const organizer = row.organizer_id ? organizerById.get(row.organizer_id) : undefined;
    const tickets = ticketsByEventId.get(row.id) ?? [];

    return {
      ...base,
      organizer: {
        name: organizer?.name ?? "Đơn vị tổ chức",
        logo: organizer?.logo_url ? { uri: organizer.logo_url } : defaultTicketLogo,
      },
      tickets: tickets.map(toTicket),
    };
  });
}
