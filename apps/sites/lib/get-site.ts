import { createClient } from '@supabase/supabase-js';
import type { Blueprint } from '@noro/types/blueprint';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

export async function getSiteBySlug(slug: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

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
