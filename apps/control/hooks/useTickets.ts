"use client";
import useSWR from "swr";

type Ticket = any;

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTickets() {
  const { data, error, isLoading, mutate } = useSWR<{ tickets: Ticket[] }>("/api/support/tickets", fetcher);
  return {
    tickets: data?.tickets || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

