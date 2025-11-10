import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Theme } from '@/constants/theme';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  theme: Theme;
  variant?: 'primary' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  theme,
  variant = 'primary',
  isLoading = false,
  icon,
  disabled,
  style,
  ...touchableProps
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      style={[
        styles.button,
        isPrimary ? [
          styles.primaryButton,
          { backgroundColor: theme.primary }
        ] : [
          styles.outlineButton,
          { 
            borderColor: theme.text,
            backgroundColor: theme.inputBackground 
          }
        ],
        (disabled || isLoading) && styles.buttonDisabled,
        style,
      ]}
      activeOpacity={0.8}
      {...touchableProps}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={isPrimary ? '#FFFFFF' : theme.text} 
          size="small"
        />
      ) : (
        <>
          <Text style={[
            styles.buttonText,
            isPrimary ? styles.primaryButtonText : { color: theme.text }
          ]}>
            {title}
          </Text>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButton: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  outlineButton: {
    borderWidth: 1.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  iconContainer: {
    marginLeft: 4,
  },
});

