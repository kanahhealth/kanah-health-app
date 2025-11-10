import { darkTheme, lightTheme, PRIMARY_COLOR } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    // If user is already authenticated, skip splash and go to dashboard
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isLoading, isAuthenticated]);

  const handleGetStarted = () => {
    router.push('/(auth)/signup');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      {/* Top Section - Logo */}
      <View style={styles.topSection}>
        <Image 
          source={require('@/assets/logo.png')} 
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={[styles.brandText, { color: theme.primary }]}>
          Kanah Health
        </Text>
      </View>

      {/* Middle Section - Content */}
      <View style={styles.middleSection}>
        <Text style={[styles.title, { color: theme.text }]}>
          Your Baby Is Part of Our Family
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Lorem ipsum dolor sit amet consectetur. Dignissim ut purus auctor amet a lectus cursus erat.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={[
              styles.loginButton,
              { 
                borderColor: theme.text,
                backgroundColor: colorScheme === 'dark' ? theme.surface : 'transparent'
              }
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.loginButtonText, { color: theme.text }]}>Login</Text>
            <ArrowRight size={20} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGetStarted}
            style={styles.signUpButton}
            activeOpacity={0.7}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Section - Illustration */}
      <View style={styles.bottomSection}>
        <View style={styles.imageWrapper}>
          <Image 
            source={require('@/assets/kanah_splash_image.png')} 
            style={styles.splashImage}
            contentFit="cover"
          />
          {/* Curved overlay */}
          <View style={[styles.curvedOverlay, { backgroundColor: theme.background }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  logo: {
    width: 120,
    height: 80,
  },
  middleSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSection: {
    flex: 1,
    position: 'relative',
    marginTop: 20,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  curvedOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
});
