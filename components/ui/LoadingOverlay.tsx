import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/theme';

interface LoadingOverlayProps {
  visible: boolean;
  text: string;
  theme: Theme;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  text,
  theme,
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
      <View style={[
        styles.modal,
        { backgroundColor: theme.overlayBackground }
      ]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.text, { color: theme.text }]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

