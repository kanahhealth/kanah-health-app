import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface AnimatedButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  style,
  onPressIn,
  onPressOut,
  ...props 
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.95, { damping: 15 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15 });
    onPressOut?.(e);
  };

  return (
    <AnimatedTouchable
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      {...props}
    >
      {children}
    </AnimatedTouchable>
  );
};

