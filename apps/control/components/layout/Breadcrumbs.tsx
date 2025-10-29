"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

function prettify(segment: string) {
  return segment.replace(/[-_]/g, ' ').replace(/^\w/, (m) => m.toUpperCase());
}

export default function Breadcrumbs({ baseHref = '/control', baseLabel = 'NORO', currentLabel }: { baseHref?: string; baseLabel?: string; currentLabel?: string }) {
  const pathname = usePathname();
  const parts = (pathname || '').split('/').filter(Boolean);
  const baseIdx = parts.findIndex((p) => p === 'control');
  const rel = baseIdx >= 0 ? parts.slice(baseIdx + 1) : parts;
  const crumbs = [{ label: baseLabel, href: baseHref }, ...rel.map((p, i) => ({
    label: prettify(p),
    href: i < rel.length - 1 ? `${baseHref}/${rel.slice(0, i + 1).join('/')}` : undefined,
  }))];
  if (currentLabel && crumbs.length > 0) {
    crumbs[crumbs.length - 1].label = currentLabel;
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-sm">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          {c.href ? (
            <Link href={c.href} className="text-slate-300 hover:text-indigo-300 transition-colors">{c.label}</Link>
          ) : (
            <span className="text-slate-100 font-semibold">{c.label}</span>
          )}
          {i < crumbs.length - 1 && <ChevronRight size={16} className="text-primary0" />}
        </span>
      ))}
    </nav>
  );
}
