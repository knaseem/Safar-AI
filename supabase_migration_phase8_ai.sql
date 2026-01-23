-- Phase 8: AI Travel Profiles (FIXED)
-- Run this in Supabase SQL Editor

-- 0. Safety cleanup: Drop table if it exists to ensure clean state
DROP TABLE IF EXISTS public.travel_profiles;

-- 1. Create travel_profiles table
CREATE TABLE public.travel_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    archetype TEXT DEFAULT 'Explorer',
    traits JSONB DEFAULT '{}'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Enable RLS
ALTER TABLE public.travel_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Users can view own profile" 
    ON public.travel_profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
    ON public.travel_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
    ON public.travel_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- 4. Ensure trigger function exists (Dependency)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Trigger for updated_at
CREATE TRIGGER update_travel_profiles_updated_at
    BEFORE UPDATE ON public.travel_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
