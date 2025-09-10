-- Allow anonymous access to staff_accounts table for login purposes
DROP POLICY IF EXISTS "Staff accounts are viewable by everyone" ON public.staff_accounts;

CREATE POLICY "Allow anonymous access to staff accounts for login"
ON public.staff_accounts
FOR SELECT
TO anon, authenticated
USING (true);