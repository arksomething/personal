-- Admin Management SQL Scripts
-- Use these queries in the Supabase SQL editor to manage admin users

-- ============================================================================
-- PROMOTE USER TO ADMIN
-- ============================================================================
-- Replace 'USER_EMAIL_HERE' with the actual user's email
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'USER_EMAIL_HERE';

-- OR use user ID if you know it:
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = 'USER_UUID_HERE';

-- ============================================================================
-- DEMOTE ADMIN TO REGULAR USER
-- ============================================================================
-- UPDATE public.profiles
-- SET role = 'commenter'
-- WHERE email = 'USER_EMAIL_HERE';

-- ============================================================================
-- LIST ALL ADMINS
-- ============================================================================
-- SELECT id, email, username, role, created_at
-- FROM public.profiles
-- WHERE role = 'admin'
-- ORDER BY created_at;

-- ============================================================================
-- LIST ALL USERS
-- ============================================================================
-- SELECT id, email, username, role, created_at
-- FROM public.profiles
-- ORDER BY created_at DESC;

