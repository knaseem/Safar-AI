import { createBrowserClient } from '@supabase/ssr'

// Safe fallbacks for build time (Vercel SSG)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createClient() {
    // During build, return a mock-safe client if env vars are missing


    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
