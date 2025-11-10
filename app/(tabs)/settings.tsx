import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        },
      ]
    );
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.background,
        paddingTop: insets.top + 20,
      }
    ]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Settings
      </Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Logged in as:
          </Text>
          <Text style={[styles.email, { color: theme.text }]}>
            {user.email}
          </Text>
          {user.name && (
            <Text style={[styles.name, { color: theme.textSecondary }]}>
              {user.name}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
    fontWeight: 'bold',
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
    fontWeight: '600',
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
    fontWeight: '600',
    fontSize: 16,
  },
});
