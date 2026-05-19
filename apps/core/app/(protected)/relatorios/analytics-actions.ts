'use server';

import { createServerSupabaseClient } from '@noro/lib/supabase/server';

export async function getAnalyticsData() {
  const supabase = createServerSupabaseClient();
  
  // 1. Fetch Leads Stats
  const { data: leads, error: leadsError } = await supabase
    .from('noro_leads')
    .select('id, stage, source, value_cents, created_at');

  // 2. Fetch Tasks Stats
  const { data: tarefas, error: tarefasError } = await supabase
    .from('noro_tarefas')
    .select('id, status, prioridade');

  if (leadsError || tarefasError) {
    console.error('Error fetching analytics data', leadsError, tarefasError);
    return {
      leadsByStage: [],
      leadsBySource: [],
      tasksByStatus: [],
      totalPotentialRevenue: 0,
      totalLeads: 0,
      totalTasks: 0,
    };
  }

  // Process Leads Data
  const leadsByStageMap = new Map<string, number>();
  const leadsBySourceMap = new Map<string, number>();
  let totalPotentialRevenue = 0;

  leads.forEach(lead => {
    // Stage Count
    const stage = lead.stage || 'undefined';
    leadsByStageMap.set(stage, (leadsByStageMap.get(stage) || 0) + 1);

    // Source Count
    const source = lead.source || 'undefined';
    leadsBySourceMap.set(source, (leadsBySourceMap.get(source) || 0) + 1);

    // Revenue
    totalPotentialRevenue += (lead.value_cents || 0);
  });

  // Process Tasks Data
  const tasksByStatusMap = new Map<string, number>();
  tarefas.forEach(task => {
    const status = task.status || 'undefined';
    tasksByStatusMap.set(status, (tasksByStatusMap.get(status) || 0) + 1);
  });

  // Format for Recharts
  const leadsByStage = Array.from(leadsByStageMap.entries()).map(([name, value]) => ({ name, value }));
  const leadsBySource = Array.from(leadsBySourceMap.entries()).map(([name, value]) => ({ name, value }));
  const tasksByStatus = Array.from(tasksByStatusMap.entries()).map(([name, value]) => ({ name, value }));

  return {
    leadsByStage,
    leadsBySource,
    tasksByStatus,
    totalPotentialRevenue: totalPotentialRevenue / 100, // Convert cents to currency unit
    totalLeads: leads.length,
    totalTasks: tarefas.length
  };
}
