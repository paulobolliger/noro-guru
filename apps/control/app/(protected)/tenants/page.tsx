"use client";
import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import TenantsHeader from "@/components/tenants/TenantsHeader";
import TenantsTable from "@/components/tenants/TenantsTable";
import TenantMetrics from "../../../components/tenants/TenantMetrics";

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTenantCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <PageContainer>
      <TenantsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTenantCreated={handleTenantCreated}
      />
      <TenantMetrics />
      <div className="my-6">
        <TenantsTable key={refreshKey} searchQuery={searchQuery} />
      </div>
    </PageContainer>
  );
}
