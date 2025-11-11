/**
 * Environment variable type declarations
 * This ensures TypeScript knows about our environment variables
 */

declare module '@env' {
  export const EXPO_PUBLIC_SUPABASE_URL: string
  export const EXPO_PUBLIC_SUPABASE_ANON_KEY: string
  export const EXPO_SUPABASE_POSTGRES_URL: string
  export const EXPO_SUPABASE_JWT_SECRET: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string
      EXPO_SUPABASE_POSTGRES_URL: string
      EXPO_SUPABASE_JWT_SECRET: string
    }
  }
}

export { }

