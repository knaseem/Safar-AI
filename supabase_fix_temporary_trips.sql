-- Run this in your Supabase SQL Editor to fix the schema
-- This will add the missing columns to temporary_trips

DO $$ 
BEGIN 
    -- Add search_query column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='temporary_trips' AND column_name='search_query') THEN
        ALTER TABLE public.temporary_trips ADD COLUMN search_query TEXT;
    END IF;

    -- Add created_at column if missing (though it usually defaults there)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='temporary_trips' AND column_name='created_at') THEN
        ALTER TABLE public.temporary_trips ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Verify it has at least 6 columns now
SELECT COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name='temporary_trips';
