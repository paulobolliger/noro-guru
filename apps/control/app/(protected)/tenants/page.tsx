import PageContainer from "@/components/layout/PageContainer";
import TenantsHeader from "@/components/tenants/TenantsHeader";
import TenantsTable from "@/components/tenants/TenantsTable";

export default function TenantsPage() {
  return (
    <PageContainer>
      <TenantsHeader />
      <div className="my-6">
        <TenantsTable />
      </div>
    </PageContainer>
  );
}

