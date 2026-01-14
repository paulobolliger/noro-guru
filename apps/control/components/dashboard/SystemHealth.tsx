'use client';

import { Users, Activity, TrendingUp, AlertCircle } from 'lucide-react';

interface SystemHealthProps {
    uptime?: number;
    responseTime?: number;
    errorRate?: number;
    status?: 'operational' | 'degraded' | 'down';
}

export default function SystemHealth({
    uptime = 100,
    responseTime = 0,
    errorRate = 0,
    status = 'operational'
}: SystemHealthProps) {
    const statusConfig = {
        operational: { label: 'OPERATIONAL', color: 'bg-green-100 text-green-700' },
        degraded: { label: 'DEGRADED', color: 'bg-yellow-100 text-yellow-700' },
        down: { label: 'DOWN', color: 'bg-red-100 text-red-700' }
    };

    return (
        <div className="surface-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusConfig[status].color}`}>
                    {statusConfig[status].label}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Uptime</div>
                    <div className="text-3xl font-bold text-gray-900">{uptime}%</div>
                </div>
                <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Response Time</div>
                    <div className="text-3xl font-bold text-gray-900">{responseTime}<span className="text-lg text-gray-500">ms</span></div>
                </div>
                <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Error Rate</div>
                    <div className="text-3xl font-bold text-gray-900">{errorRate.toFixed(2)}%</div>
                </div>
            </div>

            <div className="relative">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${status === 'operational' ? 'bg-green-500' :
                                status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${uptime}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
