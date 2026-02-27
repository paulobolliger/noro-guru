import { createClient } from '@supabase/supabase-js';
import type { Blueprint } from '@noro/types/blueprint';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getSiteBySlug(slug: string) {
  const { data, error } = await supabase
    .from('sites')
    .select('blueprint_data, theme, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  return {
    blueprint_data: data.blueprint_data as Blueprint,
    theme: data.theme,
  };
}
