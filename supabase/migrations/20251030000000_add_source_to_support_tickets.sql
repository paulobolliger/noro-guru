-- Add source column to support_tickets
-- This tracks where the ticket was created from

ALTER TABLE cp.support_tickets 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual';

COMMENT ON COLUMN cp.support_tickets.source IS 'Origin of the ticket: manual, website, tenant_dashboard, api, email';

-- Create index for common queries filtering by source
CREATE INDEX IF NOT EXISTS idx_support_tickets_source ON cp.support_tickets(source);
