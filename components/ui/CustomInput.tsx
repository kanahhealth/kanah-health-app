import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Theme } from '@/constants/theme';

interface CustomInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  theme: Theme;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon,
  theme,
  isPassword = false,
  isPasswordVisible = false,
  onTogglePassword,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text, fontFamily: theme.fonts.medium }]}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        { 
          backgroundColor: theme.inputBackground,
          borderColor: theme.inputBorder 
        }
      ]}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        <TextInput
          style={[styles.input, { color: theme.text, fontFamily: theme.fonts.regular }]}
          placeholderTextColor={theme.textTertiary}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...textInputProps}
        />
        {isPassword && onTogglePassword && (
          <TouchableOpacity 
            onPress={onTogglePassword}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={theme.textTertiary} />
            ) : (
              <Eye size={20} color={theme.textTertiary} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
});

