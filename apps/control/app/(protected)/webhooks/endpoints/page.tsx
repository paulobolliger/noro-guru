import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import EndpointsPageClient from './EndpointsPageClient';

export default async function WebhookEndpointsPage() {
  const supabase = createAdminSupabaseClient();
  const { data: endpoints, error } = await supabase
    .schema('cp')
    .from('webhooks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);

  async function remove(formData: FormData) {
    "use server";
    const id = String(formData.get('id') || '');
    const admin = createAdminSupabaseClient();
    await admin.schema('cp').from('webhooks').delete().eq('id', id);
    revalidatePath('/webhooks/endpoints');
  }

  async function toggle(formData: FormData) {
    "use server";
    const id = String(formData.get('id') || '');
    const active = String(formData.get('active') || '') === 'true';
    const admin = createAdminSupabaseClient();
    await admin.schema('cp').from('webhooks').update({ is_active: !active }).eq('id', id);
    revalidatePath('/webhooks/endpoints');
  }

  return (
    <EndpointsPageClient 
      endpoints={endpoints || []} 
      toggleAction={toggle}
      removeAction={remove}
    />
  );
}