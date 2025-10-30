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
    <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)] transition-transform duration-200 ease-in-out p-6 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-primary">{value}</h3>
          <p className={`text-sm mt-2 ${isPositive ? 'text-success' : 'text-rose-400'}`}>
            {isPositive ? '+' : '-'} {Math.abs(change)}% vs mes anterior
          </p>
        </div>
        <div className="p-3 rounded-lg border border-default bg-[var(--color-surface-alt)]">
          <Icon className={`${color} transition-colors duration-200 ease-in-out`} size={24} />
        </div>
      </div>
    </div>
  );
}
