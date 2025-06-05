import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a dummy client for development if credentials are missing
let supabase: ReturnType<typeof createClient>

// Função para criar o cliente de forma segura
function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase credentials missing. Using mock client. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    )

    // Create a mock client with dummy methods for development
    return {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    } as any
  } else {
    // Create the real client if we have credentials
    return createClient(supabaseUrl, supabaseAnonKey)
  }
}

// Only create the client if we're in a browser environment
if (typeof window !== "undefined") {
  supabase = createSupabaseClient()
} else {
  // Server-side placeholder - será criado quando necessário
  supabase = {} as any
}

// Função para garantir que o cliente existe
function ensureSupabaseClient() {
  if (typeof window !== "undefined" && (!supabase || !supabase.from)) {
    supabase = createSupabaseClient()
  }
  return supabase
}

// Export the client with safety check
export { ensureSupabaseClient as supabase }

// Types for TypeScript
export interface Atualizacao {
  id?: number
  titulo: string
  descricao: string
  autor: string
  data: string
  created_at?: string
}
