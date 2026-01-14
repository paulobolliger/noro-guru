import { BarChart3 } from 'lucide-react';
import { getAnalyticsData } from './analytics-actions';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

export const dynamic = 'force-dynamic';

export default async function RelatoriosPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <BarChart3 className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios e Análises</h1>
          <p className="text-gray-600">Extraia insights e acompanhe a performance do seu negócio.</p>
        </div>
      </div>

      <AnalyticsDashboard data={data} />
    </div>
  );
}
