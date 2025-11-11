import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, ArrowRight, ArrowLeft, MapPin, Globe, Calendar, X } from 'lucide-react-native';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { CustomButton, CustomInput, CustomAlert, LoadingOverlay } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import DatePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

export default function MotherDetailsScreen() {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [languagePreference, setLanguagePreference] = useState<'english' | 'swahili'>('english');
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'error' | 'success' | 'info' | 'warning';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const { user } = useAuth();
  const { updateOnboardingData } = useOnboarding();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  const showAlert = (type: 'error' | 'success' | 'info' | 'warning', title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message });
  };

  const handleDateChange = (params: any) => {
    if (params.date) {
      setDateOfBirth(dayjs(params.date).toDate());
    }
  };

  const handleDateConfirm = () => {
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleContinue = async () => {
    if (!fullName.trim()) {
      showAlert('error', 'Name Required', 'Please enter your full name');
      return;
    }

    setIsLoading(true);

    // Save to onboarding context
    updateOnboardingData({ 
      fullName,
      dateOfBirth,
      location,
      languagePreference 
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push('/(onboarding)/baby-details');
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.step, { color: theme.textSecondary, fontFamily: theme.fonts.medium }]}>
            Step 2 of 4
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View style={[styles.progress, { backgroundColor: theme.primary, width: '50%' }]} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fonts.heading }]}>
          Tell Us About You 👩‍🍼
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
          Help us personalize your experience
        </Text>

        {/* Full Name */}
        <CustomInput
          label="Full Name"
          icon={<User size={20} color={theme.textTertiary} />}
          theme={theme}
          placeholder="Jane Doe"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          autoFocus
        />

        {/* Date of Birth (Optional) */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text, fontFamily: theme.fonts.medium }]}>
            Date of Birth (Optional)
          </Text>
          <TouchableOpacity
            style={[
              styles.dateButton,
              { backgroundColor: theme.background, borderColor: theme.border }
            ]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Calendar size={20} color={theme.primary} />
            <Text style={[styles.dateText, { color: dateOfBirth ? theme.text : theme.textSecondary, fontFamily: theme.fonts.regular }]}>
              {dateOfBirth ? formatDate(dateOfBirth) : 'Select your birth date'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text, fontFamily: theme.fonts.semiBold }]}>
                  Select Date of Birth
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <X size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
              
              <DatePicker
                mode="single"
                date={dateOfBirth || dayjs().subtract(30, 'year').toDate()}
                onChange={handleDateChange}
                maximumDate={dayjs().toDate()}
                minimumDate={dayjs().subtract(80, 'year').toDate()}
                selectedItemColor={theme.primary}
                headerButtonColor={theme.primary}
                todayContainerStyle={{
                  borderWidth: 1,
                  borderColor: theme.primary,
                }}
                calendarTextStyle={{ 
                  color: theme.text, 
                  fontFamily: theme.fonts.regular,
                  fontSize: 16,
                }}
                headerTextStyle={{ 
                  color: theme.text, 
                  fontFamily: theme.fonts.semiBold,
                  fontSize: 18,
                }}
                weekDaysTextStyle={{ 
                  color: theme.textSecondary, 
                  fontFamily: theme.fonts.medium,
                  fontSize: 14,
                }}
                selectedTextStyle={{ 
                  color: '#FFFFFF', 
                  fontFamily: theme.fonts.semiBold,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              />

              <CustomButton
                title="Confirm"
                theme={theme}
                onPress={handleDateConfirm}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </Modal>

        {/* Location (Optional) */}
        <CustomInput
          label="Location (Optional)"
          icon={<MapPin size={20} color={theme.textTertiary} />}
          theme={theme}
          placeholder="Nairobi, Kenya"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={[styles.helpText, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
          💡 We'll add location search with OpenStreetMaps soon!
        </Text>

        {/* Language Preference */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text, fontFamily: theme.fonts.medium }]}>
            Preferred Language
          </Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                {
                  backgroundColor: languagePreference === 'english' ? theme.primary : theme.background,
                  borderColor: languagePreference === 'english' ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setLanguagePreference('english')}
              activeOpacity={0.7}
            >
              <Globe size={20} color={languagePreference === 'english' ? '#FFFFFF' : theme.text} />
              <Text
                style={[
                  styles.languageText,
                  {
                    color: languagePreference === 'english' ? '#FFFFFF' : theme.text,
                    fontFamily: theme.fonts.medium,
                  },
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                {
                  backgroundColor: languagePreference === 'swahili' ? theme.primary : theme.background,
                  borderColor: languagePreference === 'swahili' ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setLanguagePreference('swahili')}
              activeOpacity={0.7}
            >
              <Globe size={20} color={languagePreference === 'swahili' ? '#FFFFFF' : theme.text} />
              <Text
                style={[
                  styles.languageText,
                  {
                    color: languagePreference === 'swahili' ? '#FFFFFF' : theme.text,
                    fontFamily: theme.fonts.medium,
                  },
                ]}
              >
                Swahili
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        <CustomButton
          title="Continue"
          theme={theme}
          onPress={handleContinue}
          disabled={isLoading}
          isLoading={isLoading}
          icon={<ArrowRight size={20} color="#FFFFFF" />}
          style={styles.button}
        />
      </ScrollView>

      {/* Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        theme={theme}
      />

      {/* Loading */}
      <LoadingOverlay
        visible={isLoading}
        text="Saving..."
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  step: {
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 32,
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  languageText: {
    fontSize: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  dateText: {
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    marginTop: -16,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
  },
  confirmButton: {
    marginTop: 20,
  },
  button: {
    marginTop: 24,
  },
});

