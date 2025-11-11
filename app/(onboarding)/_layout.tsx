import { Stack } from 'expo-router';
import { CREAM_BACKGROUND } from '@/constants/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        contentStyle: { backgroundColor: CREAM_BACKGROUND },
      }}
    >
      <Stack.Screen name="phone-verification" />
      <Stack.Screen name="mother-details" />
      <Stack.Screen name="baby-details" />
      <Stack.Screen name="birth-type" />
    </Stack>
  );
}

