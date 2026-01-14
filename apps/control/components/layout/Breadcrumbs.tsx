"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

function prettify(segment: string) {
  return segment.replace(/[-_]/g, ' ').replace(/^\w/, (m) => m.toUpperCase());
}

export default function Breadcrumbs({
  baseHref = '/control',
  baseLabel = 'NORO',
  currentLabel,
  segmentOverrides = {}
}: {
  baseHref?: string;
  baseLabel?: string;
  currentLabel?: string;
  segmentOverrides?: Record<string, string>;
}) {
  const pathname = usePathname();
  const parts = (pathname || '').split('/').filter(Boolean);
  const baseIdx = parts.findIndex((p) => p === 'control');
  const rel = baseIdx >= 0 ? parts.slice(baseIdx + 1) : parts;

  const crumbs = [{ label: baseLabel, href: baseHref }, ...rel.map((p, i) => {
    // Check if this segment has an override
    const label = segmentOverrides[p] || prettify(p);

    return {
      label,
      href: i < rel.length - 1 ? `${baseHref}/${rel.slice(0, i + 1).join('/')}` : undefined,
    };
  })];

  // Keep currentLabel behavior for backward compatibility or specific page overrides
  if (currentLabel && crumbs.length > 0) {
    crumbs[crumbs.length - 1].label = currentLabel;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          {c.href ? (
            <Link href={c.href} className="text-gray-600 hover:text-indigo-600 transition-colors">
              {c.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold">{c.label}</span>
          )}
          {i < crumbs.length - 1 && <ChevronRight size={16} className="text-gray-400" />}
        </span>
      ))}
    </nav>
  );
}
