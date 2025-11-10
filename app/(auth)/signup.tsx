import { CustomButton, CustomInput, LoadingOverlay, SocialButton } from '@/components/ui';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Lock, Mail } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  const { signup } = useAuth();
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

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      await signup(email, password);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Please try again');
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Social Login', `${provider} login coming soon!`);
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
          <Text style={[styles.welcomeTitle, { color: theme.text }]}>
            Create an Account 👋
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
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
          <Text style={[styles.separatorText, { color: theme.textSecondary }]}>or</Text>
          <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialContainer}>
          <SocialButton
            provider="google"
            theme={theme}
            onPress={() => handleSocialLogin('Google')}
          />
          <SocialButton
            provider="apple"
            theme={theme}
            onPress={() => handleSocialLogin('Apple')}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpLinkContainer}>
          <Text style={[styles.signUpLinkText, { color: theme.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.7}
          >
            <Text style={[styles.signUpLink, { color: theme.primary }]}>
              Log in
            </Text>
          </TouchableOpacity>
        </View>

        {/* Extra padding at bottom for keyboard */}
        {isKeyboardVisible && <View style={{ height: 20 }} />}
      </ScrollView>

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
    fontWeight: 'bold',
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
    fontWeight: '600',
  },
});
