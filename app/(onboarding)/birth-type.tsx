import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Check, ArrowLeft } from 'lucide-react-native';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { CustomButton, CustomAlert, LoadingOverlay } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function BirthTypeScreen() {
  const [birthType, setBirthType] = useState<'vaginal' | 'c_section' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'error' | 'success' | 'info' | 'warning';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const { user } = useAuth();
  const { updateOnboardingData, completeOnboarding } = useOnboarding();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  const showAlert = (type: 'error' | 'success' | 'info' | 'warning', title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message });
  };

  const handleComplete = async () => {
    if (!birthType) {
      showAlert('error', 'Selection Required', 'Please select your birth type');
      return;
    }

    setIsLoading(true);

    try {
      // Save birth type to context first
      updateOnboardingData({ birthType });

      // Wait a bit to ensure state is updated, then complete onboarding
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await completeOnboarding();

      setIsLoading(false);

      if (result.success) {
        console.log('✅ Onboarding complete! Navigating to dashboard...');
        // Navigate immediately - no delay
        router.replace('/(tabs)');
      } else {
        showAlert('error', 'Setup Failed', result.error || 'Failed to complete onboarding. Please try again.');
      }
    } catch (error: any) {
      setIsLoading(false);
      showAlert('error', 'Error', error.message || 'Failed to complete onboarding');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.step, { color: theme.textSecondary, fontFamily: theme.fonts.medium }]}>
            Step 4 of 4
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View style={[styles.progress, { backgroundColor: theme.primary, width: '100%' }]} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fonts.heading }]}>
          Birth Type 🏥
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
          This helps us provide personalized care and tips
        </Text>

        {/* Birth Type Options */}
        <View style={styles.options}>
          {/* Vaginal Birth */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              {
                backgroundColor: birthType === 'vaginal' ? theme.primary + '15' : theme.background,
                borderColor: birthType === 'vaginal' ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setBirthType('vaginal')}
            activeOpacity={0.7}
          >
            <View style={styles.optionHeader}>
              <Heart 
                size={32} 
                color={birthType === 'vaginal' ? theme.primary : theme.text}
                fill={birthType === 'vaginal' ? theme.primary : 'transparent'}
              />
              {birthType === 'vaginal' && (
                <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                  <Check size={16} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={[styles.optionTitle, { color: theme.text, fontFamily: theme.fonts.semiBold }]}>
              Vaginal Birth
            </Text>
            <Text style={[styles.optionDescription, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
              Natural delivery through the birth canal
            </Text>
          </TouchableOpacity>

          {/* C-Section */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              {
                backgroundColor: birthType === 'c_section' ? theme.primary + '15' : theme.background,
                borderColor: birthType === 'c_section' ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setBirthType('c_section')}
            activeOpacity={0.7}
          >
            <View style={styles.optionHeader}>
              <Heart 
                size={32} 
                color={birthType === 'c_section' ? theme.primary : theme.text}
                fill={birthType === 'c_section' ? theme.primary : 'transparent'}
              />
              {birthType === 'c_section' && (
                <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                  <Check size={16} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={[styles.optionTitle, { color: theme.text, fontFamily: theme.fonts.semiBold }]}>
              C-Section
            </Text>
            <Text style={[styles.optionDescription, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
              Surgical delivery (Cesarean section)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Complete Button */}
        <CustomButton
          title="Complete Setup"
          theme={theme}
          onPress={handleComplete}
          disabled={isLoading || !birthType}
          isLoading={isLoading}
          style={styles.button}
        />
      </ScrollView>

      {/* Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        theme={theme}
      />

      {/* Loading */}
      <LoadingOverlay
        visible={isLoading}
        text="Completing setup..."
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  step: {
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 32,
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
  },
  options: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 20,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
  },
});

