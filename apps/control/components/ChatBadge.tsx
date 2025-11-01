'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@lib/supabase/client';

export default function ChatBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('unread_count')
          .in('status', ['active', 'waiting']);
        
        if (data && !error) {
          const total = data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
          setUnreadCount(total);
        }
      } catch (error) {
        console.error('Error fetching unread:', error);
      }
    };

    fetchUnread();

    // Update every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    
    return () => clearInterval(interval);
  }, [supabase]);

  if (unreadCount === 0) return null;

  return (
    <span className="ml-auto bg-[#D4AF37] text-[#1b1b1b] text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}
