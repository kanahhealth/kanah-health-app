import { Theme } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmationPromptProps {
  visible: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  theme: Theme;
  isDestructive?: boolean;
}

export const ConfirmationPrompt: React.FC<ConfirmationPromptProps> = ({
  visible,
  title,
  message,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  theme,
  isDestructive = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.blurContainer}>
        <BlurView 
          intensity={100} 
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onCancel}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={(e) => e.stopPropagation()}
            style={styles.bottomSheet}
          >
            <View style={[
              styles.promptContainer,
              { backgroundColor: theme.surface }
            ]}>
              {/* Handle bar */}
              <View style={[styles.handleBar, { backgroundColor: theme.border }]} />

              {/* Title */}
              <Text style={[
                styles.title,
                { 
                  color: isDestructive ? theme.primary : theme.text,
                  fontFamily: theme.fonts.heading 
                }
              ]}>
                {title}
              </Text>

              {/* Message */}
              <Text style={[
                styles.message,
                { color: theme.textSecondary, fontFamily: theme.fonts.regular }
              ]}>
                {message}
              </Text>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                {/* Cancel Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.cancelButton,
                    { backgroundColor: theme.inputBackground, borderColor: theme.border }
                  ]}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.cancelButtonText,
                    { color: theme.text, fontFamily: theme.fonts.semiBold }
                  ]}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>

                {/* Confirm Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    { backgroundColor: theme.primary }
                  ]}
                  onPress={onConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.confirmButtonText,
                    { fontFamily: theme.fonts.semiBold }
                  ]}>
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
  },
  promptContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  confirmButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

