-- Migration: Create sites table
-- Created: 2026-01-14
-- Purpose: Store AI-generated site blueprints for multi-tenant SaaS

CREATE TABLE public.sites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    slug character varying(100) NOT NULL UNIQUE,
    name character varying(200),
    blueprint_data jsonb NOT NULL,
    theme jsonb,
    status character varying(50) DEFAULT 'draft'::character varying NOT NULL,
    primary_language_id uuid,
    custom_domain character varying(255),
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid,
    
    CONSTRAINT sites_slug_format CHECK (slug ~ '^[a-z0-9-]+$'::text),
    CONSTRAINT sites_status_check CHECK (status IN ('draft', 'published', 'archived'))
);

-- Indexes
CREATE INDEX idx_sites_tenant_id ON sites(tenant_id);
CREATE INDEX idx_sites_slug ON sites(slug);
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_custom_domain ON sites(custom_domain) WHERE custom_domain IS NOT NULL;

-- RLS Policies
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see sites from their tenant
CREATE POLICY sites_tenant_isolation ON sites
    FOR ALL
    USING (tenant_id IN (
        SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    ));

-- Comments
COMMENT ON TABLE sites IS 'Stores AI-generated website blueprints for each tenant';
COMMENT ON COLUMN sites.blueprint_data IS 'Full blueprint JSON validated by BlueprintSchema';
COMMENT ON COLUMN sites.theme IS 'Theme configuration extracted from blueprint';
COMMENT ON COLUMN sites.slug IS 'URL-safe unique identifier for public access';
COMMENT ON COLUMN sites.status IS 'Publication status: draft, published, archived';
