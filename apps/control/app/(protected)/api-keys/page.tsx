import PageContainer from "@/components/layout/PageContainer";
import { listApiKeys, createApiKey, revokeApiKey, loadUsageDaily } from "./actions";
import { revalidatePath } from "next/cache";
import ApiKeysPageClient from './ApiKeysPageClient';

export default async function ApiKeysPage() {
  const keys = await listApiKeys();
  const usage = await loadUsageDaily();
  const usageByKey = usage.reduce((acc: Record<string, any[]>, row: any) => {
    acc[row.key_id] = acc[row.key_id] || [];
    acc[row.key_id].push(row);
    return acc;
  }, {} as Record<string, any[]>);

  async function create(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    await createApiKey(name);
    revalidatePath("/api-keys");
  }

  async function revoke(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    await revokeApiKey(id);
    revalidatePath("/api-keys");
  }

  return (
    <ApiKeysPageClient 
      keys={keys} 
      usageByKey={usageByKey}
      createAction={create}
      revokeAction={revoke}
    />
  );
}
