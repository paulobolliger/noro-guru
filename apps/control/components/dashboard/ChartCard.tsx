"use client";
import React from "react";
import NCard from "../ui/NCard";

export default function ChartCard({ title, subtitle, actions, children, height = 300 }: { title: string; subtitle?: string; actions?: React.ReactNode; children: React.ReactNode; height?: number }) {
  return (
    <NCard
      title={<>
        <div className="noro-card-title">{title}</div>
        {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
      </>}
      actions={actions}
      className="noro-card--chart"
    >
      <div style={{ height }}>
        {children}
      </div>
    </NCard>
  );
}

