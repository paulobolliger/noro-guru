'use client';

import { useState } from 'react';
import { Card, CardContent } from '@noro/ui/card';
import { Button } from '@noro/ui/button';
import { Calendar, Plus, Instagram, Facebook, Linkedin, AlertCircle, CheckCircle2, Video, Pin, Youtube } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@noro/ui/dialog';
import { useToast } from '@noro/ui/use-toast';

interface SocialAccount {
    id: string;
    platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'pinterest' | 'youtube';
    connected: boolean;
    username?: string;
}

export default function SocialMediaPage() {
    const { toast } = useToast();
    const [connectOpen, setConnectOpen] = useState(false);
    const [accounts, setAccounts] = useState<SocialAccount[]>([
        { id: '1', platform: 'instagram', connected: false },
        { id: '2', platform: 'facebook', connected: false },
        { id: '3', platform: 'linkedin', connected: false },
        { id: '4', platform: 'tiktok', connected: false },
        { id: '5', platform: 'pinterest', connected: false },
        { id: '6', platform: 'youtube', connected: false },
    ]);




    const handleConnect = (platform: string) => {
        // Simulação de conexão OAuth
        // Em produção, isso redirecionaria para a URL de autorização da plataforma
        // ex: /api/auth/social/instagram/authorize

        toast({
            title: "Conectando...",
            description: `Iniciando conexão com ${platform}. Aguarde...`,
        });

        setTimeout(() => {
            setAccounts(prev => prev.map(acc =>
                acc.platform === platform ? { ...acc, connected: true, username: `@${platform}_demo` } : acc
            ));
            toast({
                title: "Sucesso!",
                description: `Conta do ${platform} conectada com sucesso.`,
            });
            setConnectOpen(false);
        }, 1500);
    };

    const statusColor = (connected: boolean) => connected ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50";

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestão de Redes Sociais</h1>
                    <p className="text-gray-500">Planeje, crie e agende seus posts com inteligência artificial.</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Novo Post
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Instagram Card */}
                <Card className="border-t-4 border-t-pink-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 relative">
                            <div className="p-4 bg-pink-50 rounded-full text-pink-600">
                                <Instagram size={32} />
                            </div>
                            {accounts.find(a => a.platform === 'instagram')?.connected && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <CheckCircle2 className="text-green-500 fill-white" size={20} />
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Instagram</h3>

                        <div className="min-h-[24px] mb-6 flex items-center justify-center w-full">
                            {accounts.find(a => a.platform === 'instagram')?.connected ? (
                                <p className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full truncate max-w-[200px]">
                                    {accounts.find(a => a.platform === 'instagram')?.username}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">Não conectado</p>
                            )}
                        </div>

                        <Button
                            variant={accounts.find(a => a.platform === 'instagram')?.connected ? "outline" : "default"}
                            className={!accounts.find(a => a.platform === 'instagram')?.connected ? "w-full bg-pink-600 hover:bg-pink-700 text-white" : "w-full border-pink-200 text-pink-700 hover:bg-pink-50"}
                            onClick={() => handleConnect('instagram')}
                        >
                            {accounts.find(a => a.platform === 'instagram')?.connected ? 'Gerenciar Conta' : 'Conectar Conta'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Facebook Card */}
                <Card className="border-t-4 border-t-blue-600 hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 relative">
                            <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                                <Facebook size={32} />
                            </div>
                            {accounts.find(a => a.platform === 'facebook')?.connected && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <CheckCircle2 className="text-green-500 fill-white" size={20} />
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Facebook</h3>

                        <div className="min-h-[24px] mb-6 flex items-center justify-center w-full">
                            {accounts.find(a => a.platform === 'facebook')?.connected ? (
                                <p className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full truncate max-w-[200px]">
                                    {accounts.find(a => a.platform === 'facebook')?.username}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">Não conectado</p>
                            )}
                        </div>

                        <Button
                            variant={accounts.find(a => a.platform === 'facebook')?.connected ? "outline" : "default"}
                            className={!accounts.find(a => a.platform === 'facebook')?.connected ? "w-full bg-blue-600 hover:bg-blue-700 text-white" : "w-full border-blue-200 text-blue-700 hover:bg-blue-50"}
                            onClick={() => handleConnect('facebook')}
                        >
                            {accounts.find(a => a.platform === 'facebook')?.connected ? 'Gerenciar Conta' : 'Conectar Conta'}
                        </Button>
                    </CardContent>
                </Card>

                {/* LinkedIn Card */}
                <Card className="border-t-4 border-t-blue-800 hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 relative">
                            <div className="p-4 bg-blue-50 rounded-full text-blue-800">
                                <Linkedin size={32} />
                            </div>
                            {accounts.find(a => a.platform === 'linkedin')?.connected && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <CheckCircle2 className="text-green-500 fill-white" size={20} />
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">LinkedIn</h3>

                        <div className="min-h-[24px] mb-6 flex items-center justify-center w-full">
                            {accounts.find(a => a.platform === 'linkedin')?.connected ? (
                                <p className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full truncate max-w-[200px]">
                                    {accounts.find(a => a.platform === 'linkedin')?.username}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">Não conectado</p>
                            )}
                        </div>

                        <Button
                            variant={accounts.find(a => a.platform === 'linkedin')?.connected ? "outline" : "default"}
                            className={!accounts.find(a => a.platform === 'linkedin')?.connected ? "w-full bg-blue-800 hover:bg-blue-900 text-white" : "w-full border-blue-200 text-blue-800 hover:bg-blue-50"}
                            onClick={() => handleConnect('linkedin')}
                        >
                            {accounts.find(a => a.platform === 'linkedin')?.connected ? 'Gerenciar Conta' : 'Conectar Conta'}
                        </Button>
                    </CardContent>
                </Card>

                {/* TikTok Card */}
                <Card className="border-t-4 border-t-black hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 relative">
                            <div className="p-4 bg-gray-100 rounded-full text-black">
                                <Video size={32} />
                            </div>
                            {accounts.find(a => a.platform === 'tiktok')?.connected && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <CheckCircle2 className="text-green-500 fill-white" size={20} />
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">TikTok</h3>

                        <div className="min-h-[24px] mb-6 flex items-center justify-center w-full">
                            {accounts.find(a => a.platform === 'tiktok')?.connected ? (
                                <p className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full truncate max-w-[200px]">
                                    {accounts.find(a => a.platform === 'tiktok')?.username}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">Não conectado</p>
                            )}
                        </div>

                        <Button
                            variant={accounts.find(a => a.platform === 'tiktok')?.connected ? "outline" : "default"}
                            className={!accounts.find(a => a.platform === 'tiktok')?.connected ? "w-full bg-black hover:bg-gray-800 text-white" : "w-full border-gray-200 text-black hover:bg-gray-50"}
                            onClick={() => handleConnect('tiktok')}
                        >
                            {accounts.find(a => a.platform === 'tiktok')?.connected ? 'Gerenciar Conta' : 'Conectar Conta'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Pinterest Card */}
                <Card className="border-t-4 border-t-red-600 hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 relative">
                            <div className="p-4 bg-red-50 rounded-full text-red-600">
                                <Pin size={32} />
                            </div>
                            {accounts.find(a => a.platform === 'pinterest')?.connected && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <CheckCircle2 className="text-green-500 fill-white" size={20} />
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Pinterest</h3>

                        <div className="min-h-[24px] mb-6 flex items-center justify-center w-full">
                            {accounts.find(a => a.platform === 'pinterest')?.connected ? (
                                <p className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full truncate max-w-[200px]">
                                    {accounts.find(a => a.platform === 'pinterest')?.username}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">Não conectado</p>
                            )}
                        </div>

                        <Button
                            variant={accounts.find(a => a.platform === 'pinterest')?.connected ? "outline" : "default"}
                            className={!accounts.find(a => a.platform === 'pinterest')?.connected ? "w-full bg-red-600 hover:bg-red-700 text-white" : "w-full border-red-200 text-red-700 hover:bg-red-50"}
                            onClick={() => handleConnect('pinterest')}
                        >
                            {accounts.find(a => a.platform === 'pinterest')?.connected ? 'Gerenciar Conta' : 'Conectar Conta'}
                        </Button>
                    </CardContent>
                </Card>

                {/* YouTube Card */}
                <Card className="border-t-4 border-t-red-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 relative">
                            <div className="p-4 bg-red-50 rounded-full text-red-500">
                                <Youtube size={32} />
                            </div>
                            {accounts.find(a => a.platform === 'youtube')?.connected && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <CheckCircle2 className="text-green-500 fill-white" size={20} />
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">YouTube</h3>

                        <div className="min-h-[24px] mb-6 flex items-center justify-center w-full">
                            {accounts.find(a => a.platform === 'youtube')?.connected ? (
                                <p className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full truncate max-w-[200px]">
                                    {accounts.find(a => a.platform === 'youtube')?.username}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">Não conectado</p>
                            )}
                        </div>

                        <Button
                            variant={accounts.find(a => a.platform === 'youtube')?.connected ? "outline" : "default"}
                            className={!accounts.find(a => a.platform === 'youtube')?.connected ? "w-full bg-red-500 hover:bg-red-600 text-white" : "w-full border-red-200 text-red-600 hover:bg-red-50"}
                            onClick={() => handleConnect('youtube')}
                        >
                            {accounts.find(a => a.platform === 'youtube')?.connected ? 'Gerenciar Conta' : 'Conectar Conta'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center py-20">
                <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum post agendado</h3>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                    Use o botão "Novo Post" acima para criar conteúdo com IA e agendar para suas redes conectadas.
                </p>

                <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="mt-6">Gerenciar Conexões</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Conectar Redes Sociais</DialogTitle>
                            <DialogDescription>
                                Para a funcionalidade real, é necessário configurar Apps nas plataformas de desenvolvedor.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-800 border border-yellow-200 mb-4">
                            <p className="font-bold flex items-center gap-2"><AlertCircle size={16} /> Nota Técnica:</p>
                            <p className="mt-1">
                                A conexão utiliza o protocolo <strong>OAuth2</strong>. O usuário é redirecionado para a rede social, aprova o acesso, e a rede social retorna um <code>access_token</code> que guardamos no banco de dados seguro.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm">Ao clicar em conectar, simularemos esse fluxo:</p>
                            <Button className="w-full bg-[#E1306C] hover:bg-[#C13584]" onClick={() => handleConnect('instagram')}>Conectar Instagram</Button>
                            <Button className="w-full bg-[#1877F2] hover:bg-[#166FE5]" onClick={() => handleConnect('facebook')}>Conectar Facebook</Button>
                            <Button className="w-full bg-[#0A66C2] hover:bg-[#004182]" onClick={() => handleConnect('linkedin')}>Conectar LinkedIn</Button>
                            <Button className="w-full bg-[#000000] hover:bg-[#333333]" onClick={() => handleConnect('tiktok')}>Conectar TikTok</Button>
                            <Button className="w-full bg-[#BD081C] hover:bg-[#8B0616]" onClick={() => handleConnect('pinterest')}>Conectar Pinterest</Button>
                            <Button className="w-full bg-[#FF0000] hover:bg-[#CC0000]" onClick={() => handleConnect('youtube')}>Conectar YouTube</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
