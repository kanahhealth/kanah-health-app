import { CREAM_BACKGROUND } from '@/constants/theme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 200,
        animationTypeForReplace: 'push',
        contentStyle: { backgroundColor: CREAM_BACKGROUND },
        presentation: 'card',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{
          animation: 'fade',
          animationDuration: 200,
          contentStyle: { backgroundColor: CREAM_BACKGROUND },
        }}
      />
      <Stack.Screen 
        name="signup" 
        options={{
          animation: 'fade',
          animationDuration: 200,
          contentStyle: { backgroundColor: CREAM_BACKGROUND },
        }}
      />
    </Stack>
  );
}

