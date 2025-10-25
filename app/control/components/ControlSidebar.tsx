"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building, CreditCard, Puzzle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/control/dashboard", label: "Dashboard", icon: Home },
  { href: "/control/tenants", label: "Tenants", icon: Building },
  { href: "/control/billing", label: "Billing", icon: CreditCard },
  { href: "/control/modules", label: "Modules", icon: Puzzle },
  { href: "/control/users", label: "Users", icon: Users },
  { href: "/control/logs", label: "Logs", icon: Users },
];

export default function ControlSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-64 bg-white/5 border-r border-white/10 text-white">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="text-lg font-semibold tracking-widest">NORO</div>
        <div className="text-xs text-white/50">v1.0.0</div>
      </div>
      <nav className="p-3 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                active ? "bg-white/10 text-indigo-400" : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
