// components/admin/StatCard.tsx
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)] hover:ring-1 hover:ring-white/10 transition-all p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-primary transition-transform group-hover:-translate-y-0.5">{value}</h3>
          <p className={`text-sm mt-2 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? "↑" : "↓"} {Math.abs(change)}% vs m�s anterior
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-white/5`}>
          <Icon className={color} size={24} />
        </div>
      </div>
    </div>
  );
}