import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityView } from './ActivityView';
import { ChatView } from './ChatView';
import { TeamsView } from './TeamsView';
import { Activity, MessageSquare, Users } from 'lucide-react';

export const PrivateChatLayout = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start bg-muted/50 p-1 h-12">
          <TabsTrigger value="activity" className="flex items-center gap-2 px-6 py-2">
            <Activity className="w-4 h-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2 px-6 py-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2 px-6 py-2">
            <Users className="w-4 h-4" />
            Teams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="flex-1 m-0 p-0">
          <ActivityView />
        </TabsContent>

        <TabsContent value="chat" className="flex-1 m-0 p-0">
          <ChatView />
        </TabsContent>

        <TabsContent value="teams" className="flex-1 m-0 p-0">
          <TeamsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};