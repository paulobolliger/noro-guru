"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // On route change, show progress and animate to 100%
    setActive(true);
    setWidth(10);
    const step1 = setTimeout(() => setWidth(60), 80);
    const step2 = setTimeout(() => setWidth(90), 200);
    const done = setTimeout(() => {
      setWidth(100);
      setTimeout(() => { setActive(false); setWidth(0); }, 200);
    }, 350);
    return () => { clearTimeout(step1); clearTimeout(step2); clearTimeout(done); };
  }, [pathname]);

  if (!active) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div
        className="h-0.5 bg-[var(--noro-primary)] transition-[width] duration-200 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

