/**
 * Authentication Utilities
 * 
 * This file provides authentication functions for sign in, sign up,
 * OAuth, password reset, and session management.
 */

import { supabase, getOAuthRedirectUrl } from './supabase'
import { AuthError, Session, User } from '@supabase/supabase-js'

/**
 * Authentication result type
 */
export interface AuthResult {
  success: boolean
  user?: User
  session?: Session
  error?: string
  requiresEmailVerification?: boolean
}

/**
 * Sign in with email and password
 * @param email - User's email
 * @param password - User's password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Sign in error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: 'No user data returned',
      }
    }

    console.log('✅ User signed in successfully:', data.user.email)
    return {
      success: true,
      user: data.user,
      session: data.session,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unexpected sign in error:', error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Sign up with email and password
 * @param email - User's email
 * @param password - User's password
 * @param userData - Additional user data (phone, name, etc.)
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  userData?: {
    full_name?: string
    phone_number?: string
  }
): Promise<AuthResult> => {
  try {
    const redirectUrl = getOAuthRedirectUrl()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData || {},
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('Sign up error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        error: 'No user data returned',
      }
    }

    // Check if email confirmation is required
    const needsVerification = !data.session

    console.log(
      needsVerification
        ? '📧 User created, email verification required'
        : '✅ User created and signed in automatically'
    )

    return {
      success: true,
      user: data.user,
      session: data.session || undefined,
      requiresEmailVerification: needsVerification,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unexpected sign up error:', error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: undefined, // Will be configured in next phase
      },
    })

    if (error) {
      console.error('Google OAuth error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log('✅ Google OAuth initiated')
    return {
      success: true,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unexpected Google OAuth error:', error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Sign in with Apple OAuth
 */
export const signInWithApple = async (): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: undefined, // Will be configured in next phase
      },
    })

    if (error) {
      console.error('Apple OAuth error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log('✅ Apple OAuth initiated')
    return {
      success: true,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unexpected Apple OAuth error:', error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Sign out current user
 */
export const signOut = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log('✅ User signed out successfully')
    return {
      success: true,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unexpected sign out error:', error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Send password reset email
 * @param email - User's email
 */
export const resetPassword = async (email: string): Promise<AuthResult> => {
  try {
    const redirectUrl = getOAuthRedirectUrl()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (error) {
      console.error('Password reset error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log('✅ Password reset email sent')
    return {
      success: true,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unexpected password reset error:', error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Update user password
 * @param newPassword - New password
 */
export const updatePassword = async (newPassword: string): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      console.error('Password update error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log('✅ Password updated successfully')
    return {
      success: true,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unexpected password update error:', error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Get current session
 */
export const getSession = async (): Promise<Session | null> => {
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
 * Get current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

/**
 * Listen to auth state changes
 * @param callback - Function to call when auth state changes
 */
export const onAuthStateChange = (
  callback: (event: string, session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event)
    callback(event, session)
  })
}

