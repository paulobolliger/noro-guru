"use client"

import React from "react"

export default function PageHeader({
  title,
  subtitle,
  actions,
  sticky = true,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  sticky?: boolean
}) {
  return (
    <div className={sticky ? "sticky top-0 z-30" : ""}>
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 mb-6 rounded-xl shadow-md"
        style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
      >
        <div className="flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-white/80 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
