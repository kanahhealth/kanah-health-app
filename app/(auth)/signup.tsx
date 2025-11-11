import { CustomAlert, CustomButton, CustomInput, LoadingOverlay, SocialButton } from '@/components/ui';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Lock, Mail } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
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

  const { signup, loginWithGoogle } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const showAlert = (type: 'error' | 'success' | 'info' | 'warning', title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message });
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      showAlert('error', 'Oops, Something\'s Wrong!', 'Please fill in all fields to continue');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('error', 'Passwords Don\'t Match!', 'Please make sure your passwords match');
      return;
    }

    if (password.length < 6) {
      showAlert('error', 'Password Too Short!', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await signup(email, password);
    } catch (error: any) {
      setIsLoading(false);
      
      if (error.message?.startsWith('VERIFICATION_REQUIRED:')) {
        const userEmail = error.message.split(':')[1];
        // Navigate to verification screen
        router.push({
          pathname: '/(auth)/verify-email',
          params: { email: userEmail },
        });
      } else {
        showAlert('error', 'Signup Failed!', error.message || 'Please try again later');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (error: any) {
      setIsLoading(false);
      showAlert(
        'error',
        'Google Sign Up Failed',
        error.message || 'Failed to sign up with Google'
      );
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
        scrollEnabled={isKeyboardVisible}
        bounces={false}
        contentInsetAdjustmentBehavior="never"
      >
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.replace('/')}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, { color: theme.text, fontFamily: theme.fonts.heading }]}>
            Create an Account 👋
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
            Enter your details below to create an account
          </Text>
        </View>

        {/* Email Input */}
        <CustomInput
          label="Email"
          icon={<Mail size={20} color={theme.textTertiary} />}
          theme={theme}
          placeholder="andrew.smith@yourdomain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
        />

        {/* Password Input */}
        <CustomInput
          label="Password"
          icon={<Lock size={20} color={theme.textTertiary} />}
          theme={theme}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          isPassword
          isPasswordVisible={isPasswordVisible}
          onTogglePassword={() => setIsPasswordVisible(!isPasswordVisible)}
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* Confirm Password Input */}
        <CustomInput
          label="Confirm Password"
          icon={<Lock size={20} color={theme.textTertiary} />}
          theme={theme}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
          isPasswordVisible={isConfirmPasswordVisible}
          onTogglePassword={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSignup}
        />

        {/* Sign Up Button */}
        <CustomButton
          title="Sign up"
          theme={theme}
          onPress={handleSignup}
          disabled={isLoading}
          isLoading={isLoading}
          icon={<ArrowRight size={20} color="#FFFFFF" />}
          style={styles.signUpButton}
        />

        {/* Separator */}
        <View style={styles.separator}>
          <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
          <Text style={[styles.separatorText, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>or</Text>
          <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialContainer}>
          <SocialButton
            provider="google"
            theme={theme}
            onPress={handleGoogleLogin}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpLinkContainer}>
          <Text style={[styles.signUpLinkText, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.7}
          >
            <Text style={[styles.signUpLink, { color: theme.primary, fontFamily: theme.fonts.semiBold }]}>
              Log in
            </Text>
          </TouchableOpacity>
        </View>

        {/* Extra padding at bottom for keyboard */}
        {isKeyboardVisible && <View style={{ height: 20 }} />}
      </ScrollView>

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
        text="Creating account..."
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
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
  },
  signUpButton: {
    marginBottom: 20,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialContainer: {
    marginBottom: 20,
    gap: 10,
  },
  signUpLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpLinkText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
  },
});
