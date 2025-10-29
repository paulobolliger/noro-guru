-- Add position for Kanban ordering
ALTER TABLE cp.leads ADD COLUMN IF NOT EXISTS position double precision DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_cp_leads_stage_position ON cp.leads(stage, position);
-- Initialize positions by created_at desc if null/zero
UPDATE cp.leads l
SET position = x.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY stage ORDER BY created_at DESC) AS rn
  FROM cp.leads
) AS x
WHERE l.id = x.id AND (l.position IS NULL OR l.position = 0);