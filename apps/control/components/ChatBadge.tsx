'use client';

import { useEffect, useState } from 'react';
import { getUnreadMessagesCount } from '@/app/actions/comum';

export default function ChatBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const total = await getUnreadMessagesCount();
      setUnreadCount(total);
    };

    fetchUnread();

    // Update every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (unreadCount === 0) return null;

  return (
    <span className="ml-auto bg-[#D4AF37] text-[#1b1b1b] text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}
