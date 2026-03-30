import { useCallback, useEffect, useMemo, useState } from "react";

import type { MyTicket } from "../data";
import { useUserContext } from "../context/UserContext";
import { fetchMyTickets } from "../services/ticketingService";

export function useMyTickets() {
  const { currentUser } = useUserContext();
  const [tickets, setTickets] = useState<MyTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    if (!currentUser) {
      setTickets([]);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const rows = await fetchMyTickets({
        userId: currentUser.id,
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone,
      });
      setTickets(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải vé của bạn.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const upcomingTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status === "upcoming"),
    [tickets],
  );
  const endedTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status === "ended"),
    [tickets],
  );

  return {
    tickets,
    upcomingTickets,
    endedTickets,
    loading,
    error,
    reload: loadTickets,
  };
}
