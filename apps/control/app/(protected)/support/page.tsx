import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";

export default function SupportInboxPage() {
  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader
          title="Suporte"
          subtitle="Support inbox em desenvolvimento."
        />
      </PageContainer>
      <PageContainer>
        <div className="surface-card border border-dashed border-default rounded-xl p-6 text-sm text-muted">
          Inbox de suporte ainda nao implementada. 
          API e worker em progresso.
        </div>
      </PageContainer>
    </div>
  );
}

