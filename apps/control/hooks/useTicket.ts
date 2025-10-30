"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTicket(ticketId?: string) {
  const key = ticketId ? `/api/support/tickets/${ticketId}` : null;
  const { data, error, isLoading, mutate } = useSWR<{ ticket: any }>(key, fetcher);

  return {
    ticket: data?.ticket || null,
    isLoading,
    error,
    refresh: mutate,
  };
}

