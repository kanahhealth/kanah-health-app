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
import { CustomInput, CustomButton, SocialButton, CustomCheckbox, LoadingOverlay } from '@/components/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { login } = useAuth();
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again');
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
            Welcome Back! 👋
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
            Sign in for Exclusive Rewards
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
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {/* Remember Me & Forgot Password */}
        <View style={styles.optionsRow}>
          <CustomCheckbox
            label="Remember me"
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            theme={theme}
          />
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <CustomButton
          title="Sign in"
          theme={theme}
          onPress={handleLogin}
          disabled={isLoading}
          isLoading={isLoading}
          icon={<ArrowRight size={20} color="#FFFFFF" />}
          style={styles.signInButton}
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

        {/* Sign In Link */}
        <View style={styles.signInLinkContainer}>
          <Text style={[styles.signInLinkText, { color: theme.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.7}
          >
            <Text style={[styles.signInLink, { color: theme.primary }]}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>

        {/* Extra padding at bottom for keyboard */}
        {isKeyboardVisible && <View style={{ height: 20 }} />}
      </ScrollView>

      {/* Loading Overlay */}
      <LoadingOverlay
        visible={isLoading}
        text="Signing in..."
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
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    marginBottom: 24,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 24,
    gap: 12,
  },
  signInLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInLinkText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
