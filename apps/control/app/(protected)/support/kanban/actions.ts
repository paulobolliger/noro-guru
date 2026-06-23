"use server";
import { createDatabaseClient } from "@noro/db";
import { revalidatePath } from "next/cache";

export async function listTicketsByStatus() {
  const { client, close } = createDatabaseClient();
  try {
    const tickets = await client`
      SELECT id, subject, tenant_id, priority, status, created_at, updated_at
      FROM platform.support_tickets
      ORDER BY created_at DESC
    `;
    
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
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    throw new Error(error.message || String(error));
  } finally {
    await close();
  }
}

export async function updateTicketStatus(ticketId: string, newStatus: string) {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE platform.support_tickets
      SET 
        status = ${newStatus},
        updated_at = NOW()
      WHERE id = ${ticketId}
    `;
    
    revalidatePath('/support');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    throw new Error(error.message || String(error));
  } finally {
    await close();
  }
}
