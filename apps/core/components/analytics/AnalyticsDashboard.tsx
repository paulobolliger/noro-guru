'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@noro/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Badge } from '@noro/ui/badge';
import { DollarSign, Users, CheckSquare } from 'lucide-react';

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

type DataItem = { name: string; value: number };

interface AnalyticsProps {
    data: {
        leadsByStage: DataItem[];
        leadsBySource: DataItem[];
        tasksByStatus: DataItem[];
        totalPotentialRevenue: number;
        totalLeads: number;
        totalTasks: number;
    };
}

export default function AnalyticsDashboard({ data }: AnalyticsProps) {
    // Formatar moeda
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Potencial (Leads)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.totalPotentialRevenue)}</div>
                        <p className="text-xs text-muted-foreground">Valor total em pipeline</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalLeads}</div>
                        <p className="text-xs text-muted-foreground">Oportunidades registradas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tarefas Totais</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalTasks}</div>
                        <p className="text-xs text-muted-foreground">Atividades de gestão</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Leads by Stage */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Leads por Estágio</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.leadsByStage}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Leads by Source */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Origem dos Leads</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.leadsBySource}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.leadsBySource.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Tasks by Status */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Status das Tarefas</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.tasksByStatus} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20}>
                                    {data.tasksByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={
                                            entry.name === 'concluida' ? '#22c55e' :
                                                entry.name === 'em_andamento' ? '#3b82f6' :
                                                    '#94a3b8'
                                        } />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
