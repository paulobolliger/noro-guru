import { getTenantContext, inviteTenantUser, updateTenantMaxUsers } from '../../tenant-actions';
import { UserPlus, Users, ShoppingCart, ShieldAlert } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function TenantUsersPage({ params }: { params: { id: string } }) {
    const { users, empresa } = await getTenantContext(params.id);
    const maxUsers = empresa?.limites?.max_users || 1;
    const currentCount = users.length;

    // Calculate usage percentage
    const usagePercent = Math.min((currentCount / maxUsers) * 100, 100);
    const isLimitReached = currentCount >= maxUsers;

    async function handleInvite(formData: FormData) {
        'use server';
        const email = formData.get('email') as string;
        // Mock role for now
        const res = await inviteTenantUser(params.id, email, 'user');
        if (!res.success) {
            // Ideally use a toast here, but for Server Action simple return we might need client component wrapping
            // For now let's just re-render.
            console.error(res.error);
        }
        revalidatePath(`/tenants/${params.id}/usuarios`);
    }

    async function handleBuyPack() {
        'use server';
        await updateTenantMaxUsers(params.id, 5);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-heading">Usuários e Permissões</h2>
                    <p className="text-sm text-secondary">Gerencie quem tem acesso a este tenant.</p>
                </div>
            </div>

            {/* Limits & Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-surface-card border border-default rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <h3 className="font-bold text-heading">Capacidade do Plano</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-secondary">Usuários Ativos</span>
                            <span className="font-medium text-heading">{currentCount} / {maxUsers}</span>
                        </div>
                        <div className="h-2.5 w-full bg-surface-base rounded-full overflow-hidden border border-default">
                            <div
                                className={`h-full transition-all ${isLimitReached ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${usagePercent}%` }}
                            ></div>
                        </div>
                        {isLimitReached && (
                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <ShieldAlert size={12} /> Limite atingido. Compre mais usuários ou faça upgrade.
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-indigo-900 mb-4">Definir Limite de Usuários</h4>
                    {/* Admin Control to manually set limit */}
                    <form action={async (formData) => {
                        'use server';
                        const newLimit = parseInt(formData.get('limit') as string);
                        await updateTenantMaxUsers(params.id, newLimit);
                    }} className="flex gap-2">
                        <input
                            name="limit"
                            type="number"
                            defaultValue={maxUsers}
                            min="1"
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                            Salvar
                        </button>
                    </form>
                    <p className="text-xs text-indigo-400 mt-2">
                        Este é um controle administrativo. O cliente compra upgrades pelo painel dele (Core).
                    </p>
                </div>
            </div>

            {/* User List & Add Form */}
            <div className="bg-surface-card border border-default rounded-xl overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-heading">Lista de Usuários</h3>

                    {/* Simple Add Form (Inline for MVP) */}
                    <form action={handleInvite} className="flex gap-2">
                        <input
                            name="email"
                            type="email"
                            placeholder="email@novo.usuario"
                            className="bg-surface-base border border-default rounded-lg px-3 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary"
                            required
                            disabled={isLimitReached}
                        />
                        <button
                            type="submit"
                            disabled={isLimitReached}
                            className="btn-primary text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <UserPlus size={16} />
                            Convidar
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-surface-app text-secondary uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Permissão</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-default">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-secondary">
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-heading">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-600 to-slate-500 flex items-center justify-center text-xs text-white">
                                                    {user.nome ? user.nome.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                {user.nome || 'Sem nome'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-secondary">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-secondary hover:text-red-400 transition-colors text-xs font-medium">
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
