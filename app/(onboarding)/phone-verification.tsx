import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Phone, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { CustomButton, CustomInput, CustomAlert, LoadingOverlay } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function PhoneVerificationScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+254');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  // Refs for OTP inputs to enable auto-focus
  const otpRefs = useRef<(TextInput | null)[]>([]);
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

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validatePhoneNumber = (phone: string) => {
    // Remove spaces and check format
    const cleaned = phone.replace(/\s/g, '');
    
    // Should be +254XXXXXXXXX (total 13 chars)
    if (!cleaned.startsWith('+254')) {
      return { valid: false, message: 'Phone number must start with +254' };
    }
    
    if (cleaned.length !== 13) {
      return { valid: false, message: 'Phone number should be 13 digits (+254XXXXXXXXX)' };
    }
    
    // Check if remaining digits are numbers
    const phoneDigits = cleaned.substring(4);
    if (!/^\d{9}$/.test(phoneDigits)) {
      return { valid: false, message: 'Please enter valid digits after +254' };
    }
    
    return { valid: true, message: '' };
  };

  const handlePhoneChange = (text: string) => {
    // Always keep +254 prefix
    if (!text.startsWith('+254')) {
      setPhoneNumber('+254');
      return;
    }
    
    // Only allow numbers after +254
    const prefix = '+254';
    const digits = text.substring(4).replace(/\D/g, '');
    setPhoneNumber(prefix + digits);
  };

  const handleSendOtp = () => {
    const validation = validatePhoneNumber(phoneNumber);
    
    if (!validation.valid) {
      showAlert('error', 'Invalid Phone', validation.message);
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setShowOtpInput(true);
    
    // Mock: Show OTP in alert (remove in production)
    showAlert('success', 'OTP Sent! 📱', `Your verification code is: ${otp}\n\n(This is for testing only)`);
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');
    if (digit.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    // Handle backspace to go to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      showAlert('error', 'Incomplete OTP', 'Please enter all 6 digits');
      return;
    }

    if (enteredOtp !== generatedOtp) {
      showAlert('error', 'Invalid OTP', 'The code you entered is incorrect');
      return;
    }

    setIsLoading(true);
    
    // Save phone number to onboarding context
    updateOnboardingData({ phoneNumber });
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/(onboarding)/mother-details');
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.step, { color: theme.textSecondary, fontFamily: theme.fonts.medium }]}>
            Step 1 of 4
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View style={[styles.progress, { backgroundColor: theme.primary, width: '25%' }]} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fonts.heading }]}>
          Enter Your Phone Number 📱
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
          We'll send you a verification code
        </Text>

        {!showOtpInput ? (
          <>
            {/* Phone Input */}
            <CustomInput
              label="Phone Number"
              icon={<Phone size={20} color={theme.textTertiary} />}
              theme={theme}
              placeholder="+254 712 345 678"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              autoFocus
            />
            <Text style={[styles.helpText, { color: theme.textSecondary, fontFamily: theme.fonts.regular }]}>
              Example: +254719405599
            </Text>

            {/* Send OTP Button */}
            <CustomButton
              title="Send Verification Code"
              theme={theme}
              onPress={handleSendOtp}
              icon={<ArrowRight size={20} color="#FFFFFF" />}
              style={styles.button}
            />
          </>
        ) : (
          <>
            {/* OTP Input */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    { 
                      borderColor: digit ? theme.primary : theme.border,
                      color: theme.text,
                      backgroundColor: theme.background,
                    }
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleOtpKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0 && showOtpInput}
                />
              ))}
            </View>

            {/* Resend Code */}
            <TouchableOpacity onPress={handleSendOtp} style={styles.resendButton}>
              <Text style={[styles.resendText, { color: theme.primary, fontFamily: theme.fonts.medium }]}>
                Resend Code
              </Text>
            </TouchableOpacity>

            {/* Verify Button */}
            <CustomButton
              title="Verify & Continue"
              theme={theme}
              onPress={handleVerifyOtp}
              disabled={isLoading}
              isLoading={isLoading}
              icon={<ArrowRight size={20} color="#FFFFFF" />}
              style={styles.button}
            />
          </>
        )}
      </View>

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
        text="Verifying..."
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
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
  helpText: {
    fontSize: 12,
    marginTop: -16,
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 32,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 24,
    padding: 8,
  },
  resendText: {
    fontSize: 14,
  },
  button: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});

