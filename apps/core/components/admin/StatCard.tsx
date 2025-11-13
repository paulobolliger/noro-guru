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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className={`text-sm mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}% vs mês anterior
          </p>
        </div>
        <div className={`${color} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className={color} size={24} />
        </div>
      </div>
    </div>
  );
}