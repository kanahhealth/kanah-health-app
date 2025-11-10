import { Theme } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AlertType = 'error' | 'success' | 'info' | 'warning';

interface CustomAlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  theme: Theme;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type,
  title,
  message,
  buttonText = 'OK',
  onClose,
  theme,
}) => {
  const getIcon = () => {
    const iconSize = 48;
    const iconColor = theme.primary;

    switch (type) {
      case 'error':
        return <XCircle size={iconSize} color="#EF4444" />;
      case 'success':
        return <CheckCircle size={iconSize} color="#10B981" />;
      case 'warning':
        return <AlertCircle size={iconSize} color="#F59E0B" />;
      case 'info':
      default:
        return <Info size={iconSize} color={iconColor} />;
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'error':
        return 'rgba(239, 68, 68, 0.15)';
      case 'success':
        return 'rgba(16, 185, 129, 0.15)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.15)';
      case 'info':
      default:
        return `${theme.primary}20`;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
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
          onPress={onClose}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={[
              styles.alertContainer,
              { backgroundColor: theme.surface }
            ]}>
              {/* Icon */}
              <View style={[
                styles.iconContainer,
                { backgroundColor: getIconBackground() }
              ]}>
                {getIcon()}
              </View>

              {/* Title */}
              <Text style={[
                styles.title,
                { color: theme.text, fontFamily: theme.fonts.heading }
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

              {/* Button */}
              <TouchableOpacity
                style={[
                  styles.button, 
                  { backgroundColor: theme.primary },
                  styles.buttonShadow
                ]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.buttonText,
                  { fontFamily: theme.fonts.semiBold }
                ]}>
                  {buttonText}
                </Text>
              </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertContainer: {
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  button: {
    width: '100%',
    paddingLeft: '40%',
    paddingRight: '40%',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

