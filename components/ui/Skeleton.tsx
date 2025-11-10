import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

interface SkeletonScreenProps {
  backgroundColor: string;
}

export const SkeletonScreen: React.FC<SkeletonScreenProps> = ({ backgroundColor }) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {/* Header skeleton */}
        <View style={styles.header}>
          <Skeleton width={60} height={60} borderRadius={30} />
          <View style={styles.headerText}>
            <Skeleton width="60%" height={24} />
            <Skeleton width="40%" height={16} style={styles.marginTop} />
          </View>
        </View>

        {/* Content skeleton */}
        <View style={styles.body}>
          <Skeleton width="90%" height={32} style={styles.marginBottom} />
          <Skeleton width="100%" height={20} style={styles.marginBottom} />
          <Skeleton width="85%" height={20} style={styles.marginBottom} />
          
          <View style={styles.marginTop}>
            <Skeleton width="100%" height={56} borderRadius={12} style={styles.marginBottom} />
            <Skeleton width="100%" height={56} borderRadius={12} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E0E0E0',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  body: {
    flex: 1,
  },
  marginTop: {
    marginTop: 8,
  },
  marginBottom: {
    marginBottom: 12,
  },
});

