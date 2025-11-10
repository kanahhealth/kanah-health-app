import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmationPrompt, CustomAlert } from '@/components/ui';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'error' | 'success' | 'info' | 'warning';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'error',
    title: '',
    message: '',
  });

  const showAlert = (type: 'error' | 'success' | 'info' | 'warning', title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showAlert('error', 'Oops, Something\'s Wrong!', 'Failed to logout. Please try again.');
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.background,
        paddingTop: insets.top + 20,
      }
    ]}>
      <Text style={[styles.title, { color: theme.text, fontFamily: theme.fonts.heading }]}>
        Settings
      </Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={[styles.label, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
            Logged in as:
          </Text>
          <Text style={[styles.email, { color: theme.text, fontFamily: theme.fonts.semiBold }]}>
            {user.email}
          </Text>
          {user.name && (
            <Text style={[styles.name, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
              {user.name}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={() => setShowLogoutConfirm(true)}
        style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.logoutButtonText, { fontFamily: theme.fonts.semiBold }]}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* Logout Confirmation Prompt */}
      <ConfirmationPrompt
        visible={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to log out?"
        cancelText="Cancel"
        confirmText="Yes, Logout"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          handleLogout();
        }}
        theme={theme}
        isDestructive={true}
      />

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    marginBottom: 32,
  },
  userInfo: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
