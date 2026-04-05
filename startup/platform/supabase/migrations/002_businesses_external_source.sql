-- Deduplicate rows ingested from OpenStreetMap / other feeds
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS external_source TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS businesses_external_unique
  ON public.businesses (external_source, external_id)
  WHERE external_source IS NOT NULL AND external_id IS NOT NULL;

COMMENT ON COLUMN public.businesses.external_source IS 'e.g. openstreetmap';
COMMENT ON COLUMN public.businesses.external_id IS 'Stable id from source, e.g. osm-node-123';
