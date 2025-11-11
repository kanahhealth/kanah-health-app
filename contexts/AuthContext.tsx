import { onAuthStateChange, signInWithEmail, signOut, signUpWithEmail } from '@/lib/auth';
import { checkOnboardingStatus } from '@/lib/database';
import { signInWithGoogle as oauthGoogle } from '@/lib/oauth';
import { getCurrentUser, supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on mount and listen to auth changes
  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (session?.user) {
        setSupabaseUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setSupabaseUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Only log if it's not a "no rows" error (user might not have profile yet)
        if (error.code !== 'PGRST116') {
          console.error('Error loading user profile:', error);
        }
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          name: data.full_name,
          phone: data.phone_number,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setSupabaseUser(currentUser);
        await loadUserProfile(currentUser.id);
      } else {
        // No user logged in - this is normal
        setUser(null);
        setSupabaseUser(null);
      }
    } catch (error) {
      // Error checking auth (not just "no user")
      console.error('Error checking auth:', error);
      setUser(null);
      setSupabaseUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmail(email, password);

      if (!result.success || !result.user) {
        throw new Error(result.error || 'Login failed');
      }

      setSupabaseUser(result.user);
      await loadUserProfile(result.user.id);

      // Check onboarding status
      const onboardingStatus = await checkOnboardingStatus(result.user.id);

      if (onboardingStatus.isComplete) {
        // User completed onboarding, go to dashboard
        const userName = onboardingStatus.data?.user?.full_name || 'there';
        console.log(`Welcome back, ${userName}!`);
        router.replace('/(tabs)');
      } else {
        // User needs to complete onboarding
        console.log('Onboarding incomplete, starting onboarding flow...');
        router.replace('/(onboarding)/phone-verification');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const result = await signUpWithEmail(email, password, {
        full_name: name,
      });

      if (!result.success) {
        throw new Error(result.error || 'Signup failed');
      }

      if (result.requiresEmailVerification) {
        // Email verification required - user needs to verify then sign in
        console.log('📧 Email verification required for:', email);
        throw new Error(`VERIFICATION_REQUIRED:${email}`);
      }

      if (result.user) {
        setSupabaseUser(result.user);
        
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: result.user.id,
            email: result.user.email!,
            full_name: name || result.user.email!.split('@')[0],
            user_type: 'mother',
            email_verified: true,
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        await loadUserProfile(result.user.id);

        // New user - go to onboarding
        console.log('New user signup, starting onboarding...');
        router.replace('/(onboarding)/phone-verification');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await oauthGoogle();
      
      if (!result.success) {
        throw new Error(result.error || 'Google sign in failed');
      }

      if (result.session?.user) {
        setSupabaseUser(result.session.user);
        
        // Check if user profile exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', result.session.user.id)
          .single();

        if (!existingUser) {
          // Create user profile for new OAuth user
          await supabase.from('users').insert({
            id: result.session.user.id,
            email: result.session.user.email!,
            full_name: result.session.user.user_metadata?.full_name || result.session.user.email!.split('@')[0],
            user_type: 'mother',
            email_verified: true,
          });
        }

        await loadUserProfile(result.session.user.id);

        // Check onboarding
        const onboardingStatus = await checkOnboardingStatus(result.session.user.id);
        router.replace(onboardingStatus.isComplete ? '/(tabs)' : '/(onboarding)/phone-verification');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setSupabaseUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithGoogle,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

