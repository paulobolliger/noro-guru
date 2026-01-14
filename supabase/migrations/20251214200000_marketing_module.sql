-- Migration: Marketing Module (Social & Email)
-- Author: Antigravity
-- Date: 2025-12-14

-- SOCIAL MEDIA MODULE
CREATE TABLE IF NOT EXISTS public.noro_marketing_social_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'linkedin', 'twitter'
    username VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.noro_marketing_social_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}', -- URLs of images/videos
    platforms VARCHAR(50)[] NOT NULL, -- Array of platforms to post to
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_prompt TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EMAIL MARKETING MODULE
CREATE TABLE IF NOT EXISTS public.noro_marketing_email_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.noro_marketing_email_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    list_id UUID REFERENCES public.noro_marketing_email_lists(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, list_id, email)
);

CREATE TABLE IF NOT EXISTS public.noro_marketing_email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content_html TEXT,
    content_text TEXT,
    target_list_id UUID REFERENCES public.noro_marketing_email_lists(id),
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    stats JSONB DEFAULT '{"sent": 0, "opened": 0, "clicked": 0}'::jsonb,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.noro_marketing_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noro_marketing_social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noro_marketing_email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noro_marketing_email_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noro_marketing_email_campaigns ENABLE ROW LEVEL SECURITY;

-- Policy helper function (reusing existing generic check if possible, or defining explicit ones)
-- Assuming we use the standard "tenant_id matches user's tenant" pattern.

CREATE POLICY "Users can view their own social accounts" ON public.noro_marketing_social_accounts
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can insert their own social accounts" ON public.noro_marketing_social_accounts
    FOR INSERT WITH CHECK (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can update their own social accounts" ON public.noro_marketing_social_accounts
    FOR UPDATE USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can delete their own social accounts" ON public.noro_marketing_social_accounts
    FOR DELETE USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

-- Repeat for other tables
CREATE POLICY "Users can view their own social posts" ON public.noro_marketing_social_posts
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can manage their own social posts" ON public.noro_marketing_social_posts
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can view their own email lists" ON public.noro_marketing_email_lists
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can manage their own email lists" ON public.noro_marketing_email_lists
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can view their own contacts" ON public.noro_marketing_email_contacts
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can manage their own contacts" ON public.noro_marketing_email_contacts
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can view their own campaigns" ON public.noro_marketing_email_campaigns
    FOR SELECT USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can manage their own campaigns" ON public.noro_marketing_email_campaigns
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));
