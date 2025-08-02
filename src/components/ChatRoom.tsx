import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from './FileUpload';
import { Send, AlertTriangle, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  sender_name: string;
  message: string;
  file_url?: string;
  file_type?: string;
  is_emergency: boolean;
  created_at: string;
}

interface ChatRoomProps {
  channelId?: string;
  recipientId?: string;
  channelName?: string;
  isDirectMessage?: boolean;
}

export const ChatRoom = ({ channelId, recipientId, channelName, isDirectMessage = false }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  
  const messageText = watch('message');
  const isEmergency = watch('isEmergency');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: isDirectMessage 
            ? `recipient_id=eq.${recipientId}` 
            : `channel_id=eq.${channelId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, recipientId, isDirectMessage]);

  const fetchMessages = async () => {
    try {
      let query = supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (isDirectMessage) {
        query = query.eq('recipient_id', recipientId);
      } else {
        query = query.eq('channel_id', channelId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: any) => {
    if (!currentUser || (!data.message?.trim() && !fileUpload)) return;

    setLoading(true);
    try {
      let fileUrl = null;
      let fileType = null;

      // Upload file if provided
      if (fileUpload) {
        const fileExt = fileUpload.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('chat-files')
          .upload(fileName, fileUpload);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('chat-files')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
        fileType = fileUpload.type;
      }

      const messageData = {
        sender_id: currentUser.id,
        sender_name: currentUser.full_name,
        message: data.message || (fileUpload ? `Shared a file: ${fileUpload.name}` : ''),
        file_url: fileUrl,
        file_type: fileType,
        is_emergency: !!data.isEmergency,
        ...(isDirectMessage ? { recipient_id: recipientId } : { channel_id: channelId })
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert(messageData);

      if (error) throw error;

      reset();
      setFileUpload(null);
      setShowFileUpload(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="bg-card border-b p-4">
        <h3 className="font-semibold">
          {isDirectMessage ? `Direct Message with ${recipientId}` : channelName}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{message.sender_name}</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.created_at)}
              </span>
              {message.is_emergency && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Emergency
                </Badge>
              )}
            </div>
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">{message.message}</p>
              {message.file_url && (
                <div className="mt-2">
                  {message.file_type?.startsWith('image/') ? (
                    <img 
                      src={message.file_url} 
                      alt="Shared image" 
                      className="max-w-full h-auto rounded border"
                    />
                  ) : (
                    <a 
                      href={message.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary underline text-sm"
                    >
                      📎 Download File
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Card className="p-4 border-t">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {showFileUpload && (
            <div>
              <FileUpload
                onFileSelect={setFileUpload}
                selectedFile={fileUpload}
                className="mb-2"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              {...register('message')}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowFileUpload(!showFileUpload)}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button type="submit" disabled={loading || (!messageText?.trim() && !fileUpload)}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="emergency"
              {...register('isEmergency')}
              className="rounded"
            />
            <label htmlFor="emergency" className="text-sm text-destructive font-medium">
              🚨 Mark as Emergency Alert
            </label>
          </div>
        </form>
      </Card>
    </div>
  );
};