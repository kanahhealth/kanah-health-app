// Theme constants for light and dark mode
export const PRIMARY_COLOR = '#c26dbc'; // Fuchsia Pink - primary brand color
export const CREAM_BACKGROUND = '#F5F0E8'; // Cream background color

// Font families
export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  heading: 'Montserrat_700Bold',
  headingMedium: 'Montserrat_600SemiBold',
};

export const lightTheme = {
  background: CREAM_BACKGROUND, // Cream background for all light mode screens
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  inputBackground: '#FFFFFF',
  inputBorder: '#E5E7EB',
  primary: PRIMARY_COLOR,
  checkbox: PRIMARY_COLOR,
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayBackground: CREAM_BACKGROUND,
  fonts: FONTS,
};

export const darkTheme = {
  background: '#0F0D23',
  surface: '#1A1730',
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#374151',
  inputBackground: '#1A1730',
  inputBorder: '#374151',
  primary: PRIMARY_COLOR,
  checkbox: PRIMARY_COLOR,
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayBackground: '#1A1730',
  fonts: FONTS,
};

export type Theme = typeof lightTheme;

