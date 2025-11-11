import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface OnboardingData {
  phoneNumber: string;
  fullName: string;
  dateOfBirth?: Date | null;
  location: string;
  languagePreference: 'english' | 'swahili';
  babyBirthDates: Date[];
  babyNumber: number;
  birthType: 'vaginal' | 'c_section';
}

interface OnboardingContextType {
  onboardingData: Partial<OnboardingData>;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => Promise<{ success: boolean; error?: string }>;
  clearOnboardingData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const { user, supabaseUser } = useAuth();

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const clearOnboardingData = () => {
    setOnboardingData({});
  };

  const completeOnboarding = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!supabaseUser) {
        throw new Error('No authenticated user found');
      }

      console.log('💾 Saving onboarding data:', onboardingData);

      // 1. Check if user exists in public.users, create if not
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', supabaseUser.id)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // User doesn't exist, create it
        console.log('Creating user record in public.users...');
        const { error: insertUserError } = await supabase
          .from('users')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email!,
            phone_number: onboardingData.phoneNumber,
            full_name: onboardingData.fullName,
            user_type: 'mother',
            email_verified: supabaseUser.email_confirmed_at ? true : false,
          });

        if (insertUserError) {
          console.error('❌ Error creating user:', insertUserError);
          throw insertUserError;
        }
        console.log('✅ User record created');
      } else if (!checkError) {
        // User exists, update it
        console.log('Updating existing user record...');
        const { error: updateUserError } = await supabase
          .from('users')
          .update({
            phone_number: onboardingData.phoneNumber,
            full_name: onboardingData.fullName,
            user_type: 'mother',
          })
          .eq('id', supabaseUser.id);

        if (updateUserError) {
          console.error('❌ Error updating user:', updateUserError);
          throw updateUserError;
        }
        console.log('✅ User record updated');
      } else {
        throw checkError;
      }

      // 2. Create mother record with DOB
      if (!onboardingData.birthType) {
        throw new Error('Birth type is required');
      }

      const motherInsert: any = {
        user_id: supabaseUser.id,
        birth_type: onboardingData.birthType,
        language_preference: onboardingData.languagePreference || 'english',
        subscription_status: 'free',
      };

      // Add DOB if provided
      if (onboardingData.dateOfBirth) {
        motherInsert.dob = onboardingData.dateOfBirth.toISOString().split('T')[0];
      }

      const { data: motherData, error: motherError } = await supabase
        .from('mothers')
        .insert(motherInsert)
        .select()
        .single();

      if (motherError) {
        console.error('❌ Error creating mother record:', motherError);
        throw motherError;
      }

      console.log('✅ Mother record created:', motherData);

      // 3. Create baby record(s) with individual birth dates
      const babyRecords = [];
      const birthDates = onboardingData.babyBirthDates || [];
      
      for (let i = 0; i < (onboardingData.babyNumber || 1); i++) {
        babyRecords.push({
          mother_id: motherData.id,
          birth_date: birthDates[i]?.toISOString().split('T')[0],
          baby_number: i + 1,
        });
      }

      const { error: babyError } = await supabase
        .from('babies')
        .insert(babyRecords);

      if (babyError) {
        console.error('❌ Error creating baby records:', babyError);
        throw babyError;
      }

      console.log(`✅ ${babyRecords.length} baby record(s) created`);

      // Clear onboarding data after successful save
      clearOnboardingData();

      return { success: true };
    } catch (error: any) {
      console.error('❌ Onboarding completion error:', error);
      return { success: false, error: error.message || 'Failed to complete onboarding' };
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        completeOnboarding,
        clearOnboardingData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

