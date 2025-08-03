import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface PrivateMessage {
  id: string;
  sender_name: string;
  message: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
}

interface PrivateMessageNotification {
  id: string;
  sender_name: string;
  message: string;
  timestamp: string;
  sender_id: string;
}

export const usePrivateMessageNotifications = () => {
  const [notifications, setNotifications] = useState<PrivateMessageNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    // Listen for new private messages directed to current user
    const channel = supabase
      .channel('private-message-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `recipient_id=eq.${currentUser.id}`
        },
        (payload) => {
          const newMessage = payload.new as PrivateMessage;
          
          // Don't notify about own messages
          if (newMessage.sender_id === currentUser.id) return;
          
          const notification: PrivateMessageNotification = {
            id: newMessage.id,
            sender_name: newMessage.sender_name,
            message: newMessage.message,
            timestamp: newMessage.created_at,
            sender_id: newMessage.sender_id
          };

          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Show toast notification
          toast({
            title: `New message from ${newMessage.sender_name}`,
            description: newMessage.message.length > 50 
              ? newMessage.message.substring(0, 50) + '...' 
              : newMessage.message,
            action: (
              <div className="text-xs text-muted-foreground">
                Private Message
              </div>
            )
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const markAsRead = (notificationId?: string) => {
    if (notificationId) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } else {
      // Mark all as read
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications
  };
};