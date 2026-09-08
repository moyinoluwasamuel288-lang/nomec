import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at build/dev time rather than silently breaking every page later.
  throw new Error(
    "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Role = "student" | "parent" | "teacher" | "admin"

export interface Profile {
  id: string
  role: Role
  full_name: string
  phone: string | null
}
