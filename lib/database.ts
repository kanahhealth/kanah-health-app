/**
 * Database Connection Test and Helper Functions
 * 
 * This file provides utilities for testing database connectivity
 * and performing common database operations with proper error handling.
 */

import { supabase } from './supabase'
import type { User, Mother, Baby } from '@/constants/types'

/**
 * Database connection result type
 */
export interface ConnectionTestResult {
  success: boolean
  message: string
  timestamp?: string
  error?: string
}

/**
 * Test database connectivity
 * Attempts to query the users table to verify connection
 * 
 * @returns Promise<ConnectionTestResult>
 */
export const testDatabaseConnection = async (): Promise<ConnectionTestResult> => {
  try {
    console.log('🔄 Testing database connection...')
    
    // Attempt a simple query to test connection
    const { data, error, count } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    if (error) {
      console.error('❌ Database connection error:', error)
      return {
        success: false,
        message: 'Failed to connect to database',
        error: error.message,
      }
    }

    console.log('✅ Database connection successful!')
    return {
      success: true,
      message: `Connected successfully to Kanah Health database. Found ${count ?? 0} users.`,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('❌ Unexpected error during connection test:', error)
    
    return {
      success: false,
      message: 'Unexpected error during connection test',
      error: errorMessage,
    }
  }
}

/**
 * Check if user has completed onboarding
 * @param userId - The user's auth ID
 * @returns Object with completion status and missing steps
 */
export const checkOnboardingStatus = async (userId: string) => {
  try {
    // Check if user exists in users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return {
        isComplete: false,
        missingSteps: ['user_account'],
        data: null,
      }
    }

    // Check if mother account exists
    const { data: mother, error: motherError } = await supabase
      .from('mothers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (motherError || !mother) {
      return {
        isComplete: false,
        missingSteps: ['mother_account'],
        data: { user },
      }
    }

    // Check if baby account exists
    const { data: babies, error: babyError } = await supabase
      .from('babies')
      .select('*')
      .eq('mother_id', mother.id)

    if (babyError || !babies || babies.length === 0) {
      return {
        isComplete: false,
        missingSteps: ['baby_account'],
        data: { user, mother },
      }
    }

    // All steps complete
    return {
      isComplete: true,
      missingSteps: [],
      data: { user, mother, babies },
    }
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    throw error
  }
}

/**
 * Get user by email
 * @param email - User's email address
 */
export const getUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error
    return data as User
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

/**
 * Get mother details by user ID
 * @param userId - User's auth ID
 */
export const getMotherByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('mothers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data as Mother
  } catch (error) {
    console.error('Error getting mother details:', error)
    return null
  }
}

/**
 * Get babies by mother ID
 * @param motherId - Mother's ID
 */
export const getBabiesByMotherId = async (motherId: string) => {
  try {
    const { data, error } = await supabase
      .from('babies')
      .select('*')
      .eq('mother_id', motherId)
      .order('baby_number', { ascending: true })

    if (error) throw error
    return data as Baby[]
  } catch (error) {
    console.error('Error getting babies:', error)
    return []
  }
}

/**
 * Create or update user record
 * @param userData - User data to insert/update
 */
export const upsertUser = async (userData: Partial<User>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: data as User }
  } catch (error) {
    console.error('Error upserting user:', error)
    return { success: false, error }
  }
}

/**
 * Create or update mother record
 * @param motherData - Mother data to insert/update
 */
export const upsertMother = async (motherData: Partial<Mother>) => {
  try {
    const { data, error } = await supabase
      .from('mothers')
      .upsert(motherData)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: data as Mother }
  } catch (error) {
    console.error('Error upserting mother:', error)
    return { success: false, error }
  }
}

/**
 * Create baby record
 * @param babyData - Baby data to insert
 */
export const createBaby = async (babyData: Partial<Baby>) => {
  try {
    const { data, error } = await supabase
      .from('babies')
      .insert(babyData)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: data as Baby }
  } catch (error) {
    console.error('Error creating baby:', error)
    return { success: false, error }
  }
}

