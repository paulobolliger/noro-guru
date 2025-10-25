"use client";
import { useEffect, useState } from "react";

export function useSSE<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const source = new EventSource(url);
    source.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setData(parsed);
      } catch {
        // ignore parse errors
      }
    };
    return () => source.close();
  }, [url]);

  return data;
}

