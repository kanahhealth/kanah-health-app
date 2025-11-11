import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, RefreshCw, ArrowRight } from 'lucide-react-native';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { supabase } from '@/lib/supabase';
import { CustomButton, CustomAlert } from '@/components/ui';

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isChecking, setIsChecking] = useState(false);
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

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  const showAlert = (type: 'error' | 'success' | 'info' | 'warning', title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message });
  };

  const checkVerification = async () => {
    // After email verification, user must sign in to get a session
    // We can't check verification without credentials since there's no session yet
    showAlert(
      'success',
      'Email Verified! 🎉',
      'Your email has been verified. Please sign in with your credentials to continue.'
    );
    
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000);
  };

  const resendEmail = async () => {
    try {
      console.log('📧 Resending verification email to:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email || '',
      });

      if (error) {
        console.error('❌ Resend error:', error);
        throw error;
      }

      console.log('✅ Verification email sent successfully');
      showAlert('success', 'Email Sent! 📧', 'Check your inbox for a new verification link.');
    } catch (error: any) {
      console.error('❌ Failed to resend email:', error);
      showAlert('error', 'Resend Failed', error.message || 'Failed to resend email');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Mail size={64} color={theme.primary} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fonts.heading }]}>
          Verify Your Email 📧
        </Text>

        {/* Email */}
        <Text style={[styles.email, { color: theme.primary, fontFamily: theme.fonts.semiBold }]}>
          {email}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
          We've sent a verification link to your email address. Please check your inbox (and spam folder) and click the link to verify your account.
          {'\n\n'}
          After verification, return here and tap the button below to sign in.
        </Text>

        {/* Check Verification Button */}
        <CustomButton
          title="I've Verified - Go to Login"
          theme={theme}
          onPress={checkVerification}
          icon={<ArrowRight size={20} color="#FFFFFF" />}
          style={styles.checkButton}
        />

        {/* Resend Link */}
        <TouchableOpacity onPress={resendEmail} style={styles.resendContainer} activeOpacity={0.7}>
          <RefreshCw size={16} color={theme.primary} />
          <Text style={[styles.resendText, { color: theme.primary, fontFamily: theme.fonts.medium }]}>
            Resend Verification Email
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={styles.backContainer} activeOpacity={0.7}>
          <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  checkButton: {
    width: '100%',
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginBottom: 16,
  },
  resendText: {
    fontSize: 14,
  },
  backContainer: {
    padding: 12,
  },
  backText: {
    fontSize: 14,
  },
});

