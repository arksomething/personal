-- Row Level Security Policies for Blog Application
-- Run this file to set up RLS on your Supabase project

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Allow everyone to read all profiles (needed for displaying usernames on comments/posts)
CREATE POLICY "profiles_read_all" ON public.profiles
  FOR SELECT 
  USING (true);

-- Users can update only their own username (not role or email)
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Prevent direct inserts/deletes (handled by trigger on auth.users)

-- ============================================================================
-- POSTS TABLE POLICIES
-- ============================================================================

-- Anyone can read published posts
CREATE POLICY "posts_read_published" ON public.posts
  FOR SELECT 
  USING (published = true);

-- Admins can read all posts (including drafts)
CREATE POLICY "posts_read_admin" ON public.posts
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admins can create posts
CREATE POLICY "posts_insert_admin" ON public.posts
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admins can update posts
CREATE POLICY "posts_update_admin" ON public.posts
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admins can delete posts
CREATE POLICY "posts_delete_admin" ON public.posts
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================================
-- COMMENTS TABLE POLICIES
-- ============================================================================

-- Anyone can read comments
CREATE POLICY "comments_read_all" ON public.comments
  FOR SELECT 
  USING (true);

-- Authenticated users can create comments (must use their own user_id)
CREATE POLICY "comments_insert_authenticated" ON public.comments
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' 
    AND user_id = auth.uid()
  );

-- Users can update their own comments, admins can update any
CREATE POLICY "comments_update_own_or_admin" ON public.comments
  FOR UPDATE 
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Users can delete their own comments, admins can delete any
CREATE POLICY "comments_delete_own_or_admin" ON public.comments
  FOR DELETE 
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );


