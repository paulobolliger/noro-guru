import React from "react";

export default function PageContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-7xl px-6 md:px-8 my-6 md:my-8 space-y-6 ${className}`}>{children}</div>
  );
}
