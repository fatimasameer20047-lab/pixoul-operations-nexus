-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  author_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat channels table
CREATE TABLE public.chat_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  recipient_id UUID, -- for direct messages
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  is_emergency BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly shifts table
CREATE TABLE public.weekly_shifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  week_start_date DATE NOT NULL, -- Monday of the week
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, day_of_week, week_start_date)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_shifts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (user_id = current_setting('app.user_id')::uuid);

-- Create RLS policies for announcements
CREATE POLICY "Announcements are viewable by everyone" 
ON public.announcements FOR SELECT USING (true);

CREATE POLICY "Anyone can create announcements" 
ON public.announcements FOR INSERT WITH CHECK (true);

-- Create RLS policies for chat channels
CREATE POLICY "Chat channels are viewable by everyone" 
ON public.chat_channels FOR SELECT USING (true);

-- Create RLS policies for chat messages
CREATE POLICY "Chat messages are viewable by everyone" 
ON public.chat_messages FOR SELECT USING (true);

CREATE POLICY "Anyone can send messages" 
ON public.chat_messages FOR INSERT WITH CHECK (true);

-- Create RLS policies for weekly shifts
CREATE POLICY "Weekly shifts are viewable by everyone" 
ON public.weekly_shifts FOR SELECT USING (true);

CREATE POLICY "Anyone can create/update shifts" 
ON public.weekly_shifts FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update shifts" 
ON public.weekly_shifts FOR UPDATE USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('announcements', 'announcements', true),
('chat-files', 'chat-files', true);

-- Create storage policies for announcements
CREATE POLICY "Announcement images are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'announcements');

CREATE POLICY "Anyone can upload announcement images" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'announcements');

-- Create storage policies for chat files
CREATE POLICY "Chat files are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'chat-files');

CREATE POLICY "Anyone can upload chat files" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chat-files');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_shifts_updated_at
BEFORE UPDATE ON public.weekly_shifts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default chat channels
INSERT INTO public.chat_channels (name, description, department) VALUES
('Arcade', 'Team chat for Arcade staff', 'Arcade'),
('Front Desk', 'Team chat for Front Desk staff', 'Front Desk'),
('Tech Support', 'Team chat for Tech Support staff', 'Tech'),
('Management', 'Team chat for Management', 'Management');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.weekly_shifts;

-- Set replica identity for realtime
ALTER TABLE public.announcements REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.weekly_shifts REPLICA IDENTITY FULL;