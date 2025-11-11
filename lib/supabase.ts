/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client for React Native Expo
 * with proper configuration for authentication and storage.
 */

import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import Constants from 'expo-constants'

// Environment variables validation
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing Supabase environment variables!\n' +
    'Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.'
  )
}

// Get redirect URL for OAuth
const getOAuthRedirectUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://kanah-health.vercel.app'
  }
  return 'kanahhealth10://auth/callback'
}

/**
 * Custom storage implementation using Expo SecureStore
 * This ensures tokens are stored securely on the device
 */
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key)
    } catch (error) {
      console.error('Error getting item from SecureStore:', error)
      return null
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value)
    } catch (error) {
      console.error('Error setting item in SecureStore:', error)
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key)
    } catch (error) {
      console.error('Error removing item from SecureStore:', error)
    }
  },
}

/**
 * Initialize Supabase client with React Native configuration
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for React Native
    flowType: 'pkce', // Use PKCE flow for better security
  },
})

export { getOAuthRedirectUrl }

/**
 * Helper function to get the current session
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Helper function to get the current user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      // Suppress "Auth session missing" errors - this is normal when not logged in
      if (error.message?.includes('Auth session missing')) {
        return null
      }
      console.error('Error getting current user:', error)
      throw error
    }
    return data.user
  } catch (error: any) {
    // Suppress "Auth session missing" errors - this is normal when not logged in
    if (error.message?.includes('Auth session missing')) {
      return null
    }
    console.error('Error getting current user:', error)
    return null
  }
}

