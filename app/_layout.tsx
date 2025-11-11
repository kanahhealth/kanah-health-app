import { CREAM_BACKGROUND } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import './global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't navigate while checking auth

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    
    // Check if we're on the splash/index screen (not in auth or tabs groups)
    const onSplashScreen = !inAuthGroup && !inTabsGroup;

    // Don't redirect if we're on the splash screen - let it handle its own navigation
    if (onSplashScreen) return;

    // Protect routes: redirect unauthenticated users away from protected routes
    if (!isAuthenticated && inTabsGroup) {
      // User is not authenticated but trying to access protected tabs, redirect to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth group, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 200,
        contentStyle: { backgroundColor: CREAM_BACKGROUND },
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          animation: 'fade',
          animationDuration: 200,
          contentStyle: { backgroundColor: CREAM_BACKGROUND },
        }}
      />
      <Stack.Screen 
        name="(auth)" 
        options={{
          animation: 'fade',
          animationDuration: 200,
          contentStyle: { backgroundColor: CREAM_BACKGROUND },
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{
          animation: 'fade',
          animationDuration: 200,
          contentStyle: { backgroundColor: '#0F0D23' },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <OnboardingProvider>
        <RootLayoutNav />
      </OnboardingProvider>
    </AuthProvider>
  );
}
