"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTicketMessages(ticketId?: string) {
  const key = ticketId ? `/api/support/tickets/${ticketId}/messages` : null;
  const { data, error, isLoading, mutate } = useSWR<{ messages: any[] }>(key, fetcher, {
    refreshInterval: 0,
  });

  return {
    messages: data?.messages || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

