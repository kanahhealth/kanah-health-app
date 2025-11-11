import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Baby, ArrowRight, ArrowLeft, Calendar, X } from 'lucide-react-native';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { CustomButton, CustomAlert, LoadingOverlay } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import DatePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

export default function BabyDetailsScreen() {
  const [babyNumber, setBabyNumber] = useState(1);
  const [birthDates, setBirthDates] = useState<Date[]>([new Date()]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingBabyIndex, setEditingBabyIndex] = useState(0);
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

  const handleBabyNumberChange = (num: number) => {
    setBabyNumber(num);
    // Initialize birth dates array for each baby
    const newBirthDates = Array(num).fill(null).map((_, index) => birthDates[index] || new Date());
    setBirthDates(newBirthDates);
  };

  const handleDateChange = (params: any) => {
    if (params.date) {
      const newBirthDates = [...birthDates];
      newBirthDates[editingBabyIndex] = dayjs(params.date).toDate();
      setBirthDates(newBirthDates);
    }
  };

  const handleDateConfirm = () => {
    setShowDatePicker(false);
  };

  const openDatePicker = (index: number) => {
    setEditingBabyIndex(index);
    setShowDatePicker(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleContinue = async () => {
    // Check if any birth date is in the future
    const futureDate = birthDates.some(date => date > new Date());
    if (futureDate) {
      showAlert('error', 'Invalid Date', 'Birth date cannot be in the future');
      return;
    }

    setIsLoading(true);

    // Save to onboarding context
    updateOnboardingData({
      babyBirthDates: birthDates,
      babyNumber,
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push('/(onboarding)/birth-type');
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
            Step 3 of 4
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View style={[styles.progress, { backgroundColor: theme.primary, width: '75%' }]} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fonts.heading }]}>
          Baby's Birth Date 👶
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
          When was your little one born?
        </Text>

        {/* Number of Babies */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text, fontFamily: theme.fonts.medium }]}>
            Number of Babies
          </Text>
          <Text style={[styles.helpText, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
            Twins? Triplets? Let us know!
          </Text>
          <View style={styles.numberButtons}>
            {[1, 2, 3].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.numberButton,
                  {
                    backgroundColor: babyNumber === num ? theme.primary : theme.background,
                    borderColor: babyNumber === num ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => handleBabyNumberChange(num)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.numberText,
                    {
                      color: babyNumber === num ? '#FFFFFF' : theme.text,
                      fontFamily: theme.fonts.semiBold,
                    },
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Birth Date Pickers */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text, fontFamily: theme.fonts.medium }]}>
            Birth Date{babyNumber > 1 ? 's' : ''}
          </Text>
          {birthDates.slice(0, babyNumber).map((date, index) => (
            <View key={index} style={styles.babyDateContainer}>
              {babyNumber > 1 && (
                <Text style={[styles.babyLabel, { color: theme.textSecondary, fontFamily: theme.fonts.medium }]}>
                  Baby {index + 1}
                </Text>
              )}
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  { backgroundColor: theme.background, borderColor: theme.border }
                ]}
                onPress={() => openDatePicker(index)}
                activeOpacity={0.7}
              >
                <Calendar size={20} color={theme.primary} />
                <Text style={[styles.dateText, { color: theme.text, fontFamily: theme.fonts.regular }]}>
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
                  {babyNumber > 1 ? `Baby ${editingBabyIndex + 1} Birth Date` : 'Baby Birth Date'}
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <X size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
              
              <DatePicker
                mode="single"
                date={birthDates[editingBabyIndex] || dayjs().toDate()}
                onChange={handleDateChange}
                maximumDate={dayjs().toDate()}
                minimumDate={dayjs().subtract(5, 'year').toDate()}
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
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    marginBottom: 12,
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
  numberButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  numberButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  numberText: {
    fontSize: 24,
  },
  babyDateContainer: {
    marginBottom: 16,
  },
  babyLabel: {
    fontSize: 14,
    marginBottom: 8,
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

