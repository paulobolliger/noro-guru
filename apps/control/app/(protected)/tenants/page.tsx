import PageContainer from "@/components/layout/PageContainer";
import TenantsHeader from "@/components/tenants/TenantsHeader";

export default async function TenantsPage() {
  return (
    <PageContainer>
      <TenantsHeader />
      {/* Poderemos listar tenants aqui futuramente */}
    </PageContainer>
  );
}

