import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface RealtimeNotification {
  id: string;
  type: 'announcement' | 'emergency' | 'shift' | 'message';
  title: string;
  message: string;
  timestamp: Date;
}

export const useRealtime = () => {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  useEffect(() => {
    // Listen for new announcements
    const announcementChannel = supabase
      .channel('announcements-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'announcements'
        },
        (payload) => {
          const announcement = payload.new as any;
          const notification: RealtimeNotification = {
            id: announcement.id,
            type: 'announcement',
            title: 'New Announcement',
            message: `${announcement.author_name}: ${announcement.title}`,
            timestamp: new Date(announcement.created_at)
          };
          
          setNotifications(prev => [notification, ...prev]);
          toast({
            title: "📢 New Announcement",
            description: `${announcement.author_name}: ${announcement.title}`,
          });
        }
      )
      .subscribe();

    // Listen for emergency messages
    const emergencyChannel = supabase
      .channel('emergency-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: 'is_emergency=eq.true'
        },
        (payload) => {
          const message = payload.new as any;
          const notification: RealtimeNotification = {
            id: message.id,
            type: 'emergency',
            title: '🚨 Emergency Alert',
            message: `${message.sender_name}: ${message.message}`,
            timestamp: new Date(message.created_at)
          };
          
          setNotifications(prev => [notification, ...prev]);
          toast({
            title: "🚨 Emergency Alert",
            description: `${message.sender_name}: ${message.message}`,
            variant: "destructive"
          });
        }
      )
      .subscribe();

    // Listen for shift changes
    const shiftChannel = supabase
      .channel('shifts-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'weekly_shifts'
        },
        (payload) => {
          const shift = payload.new as any;
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const notification: RealtimeNotification = {
            id: shift.id,
            type: 'shift',
            title: 'New Shift Added',
            message: `${shift.user_name} added a shift for ${days[shift.day_of_week - 1]}`,
            timestamp: new Date(shift.created_at)
          };
          
          setNotifications(prev => [notification, ...prev]);
          toast({
            title: "📅 Shift Update",
            description: `${shift.user_name} added a shift for ${days[shift.day_of_week - 1]}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(announcementChannel);
      supabase.removeChannel(emergencyChannel);
      supabase.removeChannel(shiftChannel);
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    clearNotifications
  };
};