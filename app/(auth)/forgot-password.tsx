import { darkTheme, lightTheme } from '@/constants/theme';
import { router } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomInput, CustomButton, LoadingOverlay, CustomAlert } from '@/components/ui';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'error' | 'success' | 'info' | 'warning';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'error',
    title: '',
    message: '',
  });

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  const showAlert = (type: 'error' | 'success' | 'info' | 'warning', title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message });
  };

  const handleSendOTP = async () => {
    if (!email) {
      showAlert('error', 'Oops, Something\'s Wrong!', 'Please enter your registered email to continue');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('error', 'Invalid Email!', 'Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsLoading(false);
      
      // Mock success
      showAlert('success', 'OTP Sent Successfully!', 'OTP code has been sent to your email. Please check your inbox.');
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      showAlert('error', 'Oops, Something\'s Wrong!', 'Failed to send OTP. Please try again later');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20 }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text, fontFamily: theme.fonts.heading }]}>
            Forgot Your Password? 🔑
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
            We've got you covered. Enter your registered email to reset your password. We will send an OTP code to your email for the next steps.
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: theme.text, fontFamily: theme.fonts.medium }]}>
            Your Registered Email
          </Text>
          <CustomInput
            icon={<Mail size={20} color={theme.textTertiary} />}
            theme={theme}
            placeholder="andrew.ainsley@yourdomain.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={handleSendOTP}
            label=""
          />
        </View>
      </ScrollView>

      {/* Send OTP Button - Fixed at bottom */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
        <CustomButton
          title="Send OTP Code"
          theme={theme}
          onPress={handleSendOTP}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </View>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        theme={theme}
      />

      {/* Loading Overlay */}
      <LoadingOverlay
        visible={isLoading}
        text="Sending OTP..."
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
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 32,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});

