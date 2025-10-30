"use client";
import useSWR from "swr";

type Tenant = {
  id: string;
  name: string;
  slug: string;
  role?: string | null;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSupportMeta() {
  const { data, error, isLoading, mutate } = useSWR<{
    tenants: Tenant[];
    activeTenantId: string | null;
    userId: string;
  }>("/api/support/meta", fetcher);

  return {
    tenants: data?.tenants || [],
    activeTenantId: data?.activeTenantId || null,
    userId: data?.userId || null,
    isLoading,
    error,
    refresh: mutate,
  };
}

