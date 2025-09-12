import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthProvider';
import { chatService, type ChatMessage } from '@/services/chatService';
import { FileUpload } from './FileUpload';
import { Send, AlertTriangle, Paperclip } from 'lucide-react';

// Use ChatMessage from the service

interface ChatRoomProps {
  channelId?: string;
  recipientId?: string;
  channelName?: string;
  isDirectMessage?: boolean;
}

export const ChatRoom = ({ channelId, recipientId, channelName, isDirectMessage = false }: ChatRoomProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
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
    
    // Set up real-time listener for new messages
    const unsubscribe = chatService.addListener(() => {
      fetchMessages(); // Reload messages when new ones arrive
    });

    return unsubscribe;
  }, [channelId, recipientId, isDirectMessage]);

  const fetchMessages = () => {
    try {
      if (isDirectMessage && user && recipientId) {
        const msgs = chatService.getDirectMessages(user.id, recipientId);
        setMessages(msgs);
      } else if (!isDirectMessage && channelId) {
        const msgs = chatService.getChannelMessages(channelId);
        setMessages(msgs);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: any) => {
    if (!user || (!data.message?.trim() && !fileUpload)) return;

    setLoading(true);
    try {
      let fileUrl = null;
      let fileType = null;

      // Handle file upload locally
      if (fileUpload) {
        fileUrl = await chatService.storeFile(fileUpload);
        fileType = fileUpload.type;
      }

      const messageData = {
        sender_id: user.id,
        sender_name: user.full_name,
        message: data.message || (fileUpload ? `Shared a file: ${fileUpload.name}` : ''),
        file_url: fileUrl,
        file_type: fileType,
        is_emergency: !!data.isEmergency,
        ...(isDirectMessage ? { recipient_id: recipientId } : { channel_id: channelId })
      };

      chatService.sendMessage(messageData);

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
                      src={chatService.getFileUrl(message.file_url) || message.file_url} 
                      alt="Shared image" 
                      className="max-w-full h-auto rounded border"
                    />
                  ) : (
                    <a 
                      href={chatService.getFileUrl(message.file_url) || message.file_url} 
                      download
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