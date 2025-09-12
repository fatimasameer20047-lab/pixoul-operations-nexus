export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  file_url?: string;
  file_type?: string;
  is_emergency: boolean;
  created_at: string;
  recipient_id?: string;
  channel_id?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  department?: string;
  unread_count?: number;
}

const MESSAGES_STORAGE_KEY = 'arcade_chat_messages';
const CHANNELS_STORAGE_KEY = 'arcade_chat_channels';

class ChatService {
  private messages: ChatMessage[] = [];
  private channels: ChatChannel[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultChannels();
  }

  private loadFromStorage(): void {
    try {
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      this.messages = storedMessages ? JSON.parse(storedMessages) : [];
      
      const storedChannels = localStorage.getItem(CHANNELS_STORAGE_KEY);
      this.channels = storedChannels ? JSON.parse(storedChannels) : [];
    } catch {
      this.messages = [];
      this.channels = [];
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(this.messages));
    localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(this.channels));
  }

  private initializeDefaultChannels(): void {
    if (this.channels.length === 0) {
      const defaultChannels: ChatChannel[] = [
        { id: '1', name: 'general', description: 'General team discussions', department: 'All' },
        { id: '2', name: 'ai-team', description: 'AI department discussions', department: 'AI' },
        { id: '3', name: 'announcements', description: 'Official announcements only', department: 'All' },
        { id: '4', name: 'tech-support', description: 'Technical support and troubleshooting', department: 'All' },
      ];
      this.channels = defaultChannels;
      this.saveToStorage();
    }
  }

  addListener(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  sendMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): ChatMessage {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };

    this.messages.push(newMessage);
    this.saveToStorage();
    
    // Simulate real-time by notifying listeners after a short delay
    setTimeout(() => this.notifyListeners(), 100);
    
    return newMessage;
  }

  getChannelMessages(channelId: string): ChatMessage[] {
    return this.messages
      .filter(msg => msg.channel_id === channelId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  getDirectMessages(userId: string, recipientId: string): ChatMessage[] {
    return this.messages
      .filter(msg => 
        (msg.sender_id === userId && msg.recipient_id === recipientId) ||
        (msg.sender_id === recipientId && msg.recipient_id === userId)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  getChannels(): ChatChannel[] {
    return [...this.channels];
  }

  getChannel(id: string): ChatChannel | undefined {
    return this.channels.find(channel => channel.id === id);
  }

  // Utility method to store file uploads locally (simulate file upload)
  storeFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        // In a real app, you'd upload to a server. Here we store in localStorage
        const fileId = Date.now().toString();
        localStorage.setItem(`chat_file_${fileId}`, dataUrl);
        resolve(`local_file_${fileId}`);
      };
      reader.readAsDataURL(file);
    });
  }

  getFileUrl(fileId: string): string | null {
    if (fileId.startsWith('local_file_')) {
      const actualId = fileId.replace('local_file_', '');
      return localStorage.getItem(`chat_file_${actualId}`);
    }
    return null;
  }
}

export const chatService = new ChatService();