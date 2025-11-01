"use server";
import { createServerSupabaseClient } from "@noro/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function listTicketsByStatus() {
  const supabase = createServerSupabaseClient();
  
  const { data: tickets, error } = await supabase
    .schema('cp')
    .from('support_tickets')
    .select('id, subject, tenant_id, priority, status, created_at, updated_at')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tickets:', error);
    throw new Error(error.message);
  }
  
  // Group by status
  const grouped: Record<string, any[]> = {
    open: [],
    'in-progress': [],
    waiting: [],
    resolved: [],
    closed: [],
  };
  
  (tickets || []).forEach((ticket) => {
    const status = (ticket.status || 'open').toLowerCase();
    if (grouped[status]) {
      grouped[status].push(ticket);
    } else {
      grouped.open.push(ticket); // fallback
    }
  });
  
  return grouped;
}

export async function updateTicketStatus(ticketId: string, newStatus: string) {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .schema('cp')
    .from('support_tickets')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', ticketId);
  
  if (error) {
    console.error('Error updating ticket:', error);
    throw new Error(error.message);
  }
  
  revalidatePath('/support');
  return { success: true };
}
