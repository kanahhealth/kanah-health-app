import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';

interface SocialButtonProps extends TouchableOpacityProps {
  provider: 'google' | 'apple';
  theme: Theme;
  onPress: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  theme,
  onPress,
  ...touchableProps
}) => {
  const isGoogle = provider === 'google';
  const iconName = isGoogle ? 'google' : 'apple';
  const iconColor = isGoogle ? '#4285F4' : theme.text;
  const label = `Continue with ${isGoogle ? 'Google' : 'Apple'}`;

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        { 
          backgroundColor: theme.inputBackground,
          borderColor: theme.border 
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      {...touchableProps}
    >
      <MaterialCommunityIcons 
        name={iconName} 
        size={24} 
        color={iconColor} 
        style={styles.icon} 
      />
      <Text style={[styles.text, { color: theme.text, fontFamily: theme.fonts.regular }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
    width: 24,
    height: 24,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
});

