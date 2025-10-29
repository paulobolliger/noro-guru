-- visa-api Stage 2
-- Ajustes de performance, defaults e FK opcional

-- 1) Índices para consultas comuns
CREATE INDEX IF NOT EXISTS idx_vr_from_to ON public.visa_requirements(country_from, country_to);
CREATE INDEX IF NOT EXISTS idx_vr_updated_at ON public.visa_requirements(updated_at);

-- 2) Defaults textuais para purpose/duration (evitar NULL na chave lógica)
ALTER TABLE public.visa_requirements ALTER COLUMN purpose SET DEFAULT '';
ALTER TABLE public.visa_requirements ALTER COLUMN duration SET DEFAULT '';

-- Backfill de NULL -> '' caso existam
UPDATE public.visa_requirements SET purpose = '' WHERE purpose IS NULL;
UPDATE public.visa_requirements SET duration = '' WHERE duration IS NULL;

-- 3) FK opcional de country_to -> visa_countries.iso2 (aplicar quando dados estiverem consistentes)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vr_country_to_fk'
  ) THEN
    -- Descomente quando pronto para impor integridade referencial
    -- ALTER TABLE public.visa_requirements
    --   ADD CONSTRAINT vr_country_to_fk FOREIGN KEY (country_to)
    --   REFERENCES public.visa_countries(iso2) ON DELETE RESTRICT;
    NULL;
  END IF;
END $$;

-- Fim visa-api Stage 2
