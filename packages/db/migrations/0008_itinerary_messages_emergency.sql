-- Migration 0008: proposal_itinerary_items, proposal_messages, emergency_contacts
-- Sprint Portal Fase 1 — itinerário por dia, chat agência/cliente, central de emergência

CREATE TABLE noro.proposal_itinerary_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  proposal_id UUID NOT NULL REFERENCES noro.proposals(id),
  data        TEXT,           -- YYYY-MM-DD
  hora_inicio TEXT,           -- HH:MM
  hora_fim    TEXT,           -- HH:MM nullable
  tipo        TEXT NOT NULL DEFAULT 'outro',
  local       TEXT,
  titulo      TEXT NOT NULL,
  descricao   TEXT,
  endereco    TEXT,
  document_id UUID REFERENCES noro.proposal_documents(id),
  ordem       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX pii_tenant_id_idx   ON noro.proposal_itinerary_items(tenant_id);
CREATE INDEX pii_proposal_id_idx ON noro.proposal_itinerary_items(proposal_id);
CREATE INDEX pii_data_ordem_idx  ON noro.proposal_itinerary_items(proposal_id, data, ordem);

--> statement-breakpoint

CREATE TABLE noro.proposal_messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL,
  proposal_id      UUID NOT NULL REFERENCES noro.proposals(id),
  sender_type      TEXT NOT NULL,   -- 'agent' | 'client'
  sender_user_id   UUID,
  sender_client_id UUID,
  content          TEXT NOT NULL,
  read_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX pm_tenant_id_idx  ON noro.proposal_messages(tenant_id);
CREATE INDEX pm_proposal_id_idx ON noro.proposal_messages(proposal_id);
CREATE INDEX pm_created_at_idx ON noro.proposal_messages(proposal_id, created_at);

--> statement-breakpoint

CREATE TABLE noro.emergency_contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  proposal_id UUID REFERENCES noro.proposals(id),  -- NULL = global do tenant
  tipo        TEXT NOT NULL DEFAULT 'outro',
  nome        TEXT NOT NULL,
  telefone    TEXT,
  whatsapp    TEXT,
  email       TEXT,
  observacoes TEXT,
  ordem       INTEGER NOT NULL DEFAULT 0,
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ec_tenant_id_idx  ON noro.emergency_contacts(tenant_id);
CREATE INDEX ec_proposal_id_idx ON noro.emergency_contacts(proposal_id);
CREATE INDEX ec_ativo_idx       ON noro.emergency_contacts(tenant_id, ativo);
