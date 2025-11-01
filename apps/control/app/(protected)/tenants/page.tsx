"use client";
import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import TenantsHeader from "@/components/tenants/TenantsHeader";
import TenantsTable from "@/components/tenants/TenantsTable";
import TenantMetrics from "../../../components/tenants/TenantMetrics";

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PageContainer>
      <TenantsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <TenantMetrics />
      <div className="my-6">
        <TenantsTable searchQuery={searchQuery} />
      </div>
    </PageContainer>
  );
}
