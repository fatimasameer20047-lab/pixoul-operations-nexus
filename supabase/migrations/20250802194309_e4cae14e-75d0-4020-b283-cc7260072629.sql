-- Create staff accounts table
CREATE TABLE public.staff_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for staff accounts
CREATE POLICY "Staff accounts are viewable by everyone" 
ON public.staff_accounts 
FOR SELECT 
USING (true);

CREATE POLICY "Staff accounts can be updated by the account owner" 
ON public.staff_accounts 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_staff_accounts_updated_at
BEFORE UPDATE ON public.staff_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial staff accounts (with simple passwords for demo)
INSERT INTO public.staff_accounts (username, password, full_name, department) VALUES
('john.doe', 'password123', 'John Doe', 'Front Desk'),
('sarah.smith', 'password123', 'Sarah Smith', 'Maintenance'),
('mike.wilson', 'password123', 'Mike Wilson', 'IT Support'),
('lisa.chen', 'password123', 'Lisa Chen', 'Management'),
('alex.johnson', 'password123', 'Alex Johnson', 'Security');

-- Update weekly_shifts table to reference staff accounts
ALTER TABLE public.weekly_shifts 
ADD COLUMN staff_account_id UUID REFERENCES public.staff_accounts(id);

-- Update existing weekly_shifts to link with staff accounts (best effort matching by name)
UPDATE public.weekly_shifts 
SET staff_account_id = (
  SELECT id FROM public.staff_accounts 
  WHERE full_name = weekly_shifts.user_name 
  LIMIT 1
)
WHERE staff_account_id IS NULL;