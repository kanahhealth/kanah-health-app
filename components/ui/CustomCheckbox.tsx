import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Theme } from '@/constants/theme';

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  theme: Theme;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked,
  onPress,
  theme,
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={[
        styles.checkbox,
        { borderColor: theme.primary },
        checked && { 
          backgroundColor: theme.checkbox, 
          borderColor: theme.checkbox 
        }
      ]}>
        {checked && <Check size={16} color="#FFFFFF" />}
      </View>
      <Text style={[styles.label, { color: theme.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
  },
});

