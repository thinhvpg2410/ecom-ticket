import { useEffect, useState } from "react";

import { events as fallbackEvents, type EventItem } from "../data";
import { fetchEvents } from "../services/eventsService";

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const rows = await fetchEvents();
        if (!isMounted) return;
        setEvents(rows);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setEvents(fallbackEvents);
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu sự kiện.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return { events, isLoading, error };
}
