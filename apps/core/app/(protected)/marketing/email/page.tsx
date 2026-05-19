'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Users, CreditCard, Plus, FileText, Send, MoreHorizontal, Search, Upload, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function EmailMarketingPage() {
    const { toast } = useToast();
    const [balance, setBalance] = useState(2550); // Simulado em centavos (R$ 25,50)

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span><strong>Em Desenvolvimento</strong> — As estatísticas e campanhas exibidas são dados fictícios. A integração real com AWS SES ainda não foi implementada.</span>
            </div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">E-mail Marketing</h1>
                    <p className="text-gray-500">Crie, envie e acompanhe campanhas de e-mail de alta conversão.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
                        <CreditCard size={16} />
                        Saldo: {formatCurrency(balance)}
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                        <Plus size={16} /> Nova Campanha
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total de Contatos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Users className="text-blue-500" size={24} />
                            <span className="text-2xl font-bold text-gray-900">1,234</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">+12% este mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">E-mails Enviados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Send className="text-green-500" size={24} />
                            <span className="text-2xl font-bold text-gray-900">8,540</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Últimos 30 dias</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Taxa de Abertura</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Mail className="text-purple-500" size={24} />
                            <span className="text-2xl font-bold text-gray-900">24.8%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Média do setor: 18%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="campaigns" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
                    <TabsTrigger value="lists">Listas de Contatos</TabsTrigger>
                    <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>

                {/* CAMPAIGNS TAB */}
                <TabsContent value="campaigns" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Campanhas Recentes</CardTitle>
                            <CardDescription>Gerencie seus disparos de e-mail.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border border-slate-200">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">Nome da Campanha</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Enviados</th>
                                            <th className="px-4 py-3">Abertura</th>
                                            <th className="px-4 py-3">Data</th>
                                            <th className="px-4 py-3 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {/* Mock Row 1 */}
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-slate-400" />
                                                    Newsletter Mensal - Dezembro
                                                </div>
                                            </td>
                                            <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">Enviado</span></td>
                                            <td className="px-4 py-3 text-slate-600">1,200</td>
                                            <td className="px-4 py-3 text-slate-600">28%</td>
                                            <td className="px-4 py-3 text-slate-500">14 Dez, 2025</td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                        {/* Mock Row 2 */}
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-slate-400" />
                                                    Promoção de Natal
                                                </div>
                                            </td>
                                            <td className="px-4 py-3"><span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">Rascunho</span></td>
                                            <td className="px-4 py-3 text-slate-600">-</td>
                                            <td className="px-4 py-3 text-slate-600">-</td>
                                            <td className="px-4 py-3 text-slate-500">10 Dez, 2025</td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-8 text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                <p className="text-slate-500 mb-4">Crie uma nova campanha para engajar seus clientes.</p>
                                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                    Criar Campanha do Zero
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* LISTS TAB */}
                <TabsContent value="lists" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Suas Listas</CardTitle>
                                <CardDescription>Gerencie grupos de contatos.</CardDescription>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Upload size={16} /> Importar CSV
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900">Clientes VIP</h4>
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">540 contatos</span>
                                    </div>
                                    <p className="text-sm text-slate-500">Lista principal de clientes recorrentes.</p>
                                </div>
                                <div className="p-4 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900">Leads Newsletter</h4>
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">890 contatos</span>
                                    </div>
                                    <p className="text-sm text-slate-500">Capturados via formulário do site.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SETTINGS TAB */}
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações de Envio</CardTitle>
                            <CardDescription>Gerencie remetentes e configurações de envio de e-mail.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-amber-50 text-amber-800 rounded border border-amber-200 text-sm">
                                    <p className="font-bold mb-1">Status AWS SES: Aguardando aprovação</p>
                                    <p>A conta AWS SES ainda está em processo de aprovação para envio em produção. O envio de e-mails reais não está disponível no momento.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
