'use server';

import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-helper";
import { revalidatePath } from "next/cache";

export async function purchaseCredits(type: 'ai' | 'email', amount: number, cost: number) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        const tenantId = await getCurrentTenantId(user.id);
        const supabaseAdmin = createClient(); // Ideally utilize a service role client but using scoped client with triggers is safer if policies allow

        if (type === 'ai') {
            // 1. Insert Transaction (Purchase)
            // Note: Since we don't have a real payment gateway, we mock the success.
            const amountCents = Math.round(amount * 100);

            const { error: txError } = await supabase
                .from('noro_ai_transactions')
                .insert({
                    tenant_id: tenantId,
                    amount_cents: amountCents,
                    type: 'purchase',
                    description: `Compra de Créditos IA (Pacote R$ ${amount})`,
                    metadata: { 
                        method: 'mock_payment',
                        user_id: user.id
                    }
                });

            if (txError) throw txError;
            // The trigger update_ai_wallet_balance updates the wallet automatically
        } 
        else if (type === 'email') {
            // 1. Update Email Quota
            // Fetch current limits
            const { data: empresa, error: fetchError } = await supabase
                .from('noro_empresa')
                .select('id, limites')
                .eq('tenant_id', tenantId)
                .single();

            if (fetchError || !empresa) throw new Error("Empresa não encontrada");

            const currentQuota = empresa.limites?.email_monthly_quota || 0;
            const newQuota = currentQuota + amount;

            const newLimites = {
                ...empresa.limites,
                email_monthly_quota: newQuota
            };

            const { error: updateError } = await supabase
                .from('noro_empresa')
                .update({ limites: newLimites })
                .eq('id', empresa.id);

            if (updateError) throw updateError;
            
            // Optionally record a transaction for record keeping if we had a generalized transaction table
            // For now, the quota update is the result.
        }

        revalidatePath('/custos');
        return { success: true };

    } catch (error: any) {
        console.error("Erro ao comprar créditos:", error.message);
        return { success: false, error: error.message };
    }
}
