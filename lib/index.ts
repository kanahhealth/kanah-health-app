/**
 * Central export point for all library utilities
 * This allows for cleaner imports throughout the app
 * 
 * Usage:
 * import { supabase, signInWithEmail, testDatabaseConnection } from '@/lib'
 */

// Supabase client and utilities
export { supabase, getSession, getCurrentUser } from './supabase'

// Authentication functions
export {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  signOut,
  resetPassword,
  updatePassword,
  onAuthStateChange,
  type AuthResult,
} from './auth'

// Database utilities
export {
  testDatabaseConnection,
  checkOnboardingStatus,
  getUserByEmail,
  getMotherByUserId,
  getBabiesByMotherId,
  upsertUser,
  upsertMother,
  createBaby,
  type ConnectionTestResult,
} from './database'

// OAuth utilities
export {
  signInWithGoogle,
  getRedirectUri,
} from './oauth'

