"use client";
import useSWR from "swr";

type Ticket = any;

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Filters = {
  status?: string;
  priority?: string;
  search?: string;
};

export function useTickets(filters: Filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.search) params.set("search", filters.search);
  const key = params.toString() ? `/api/support/tickets?${params.toString()}` : "/api/support/tickets";

  const { data, error, isLoading, mutate } = useSWR<{ tickets: Ticket[] }>(key, fetcher);
  return {
    tickets: data?.tickets || [],
    isLoading,
    error,
    refresh: mutate,
  };
}
