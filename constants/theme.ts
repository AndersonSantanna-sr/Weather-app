const baseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: {
      regular: 'SpaceMono',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 18,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    fontWeight: {
      regular: '400' as const,
      bold: '700' as const,
    },
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 30,
  },
};

const lightColors = {
  text: {
    primary: '#2D3748',
    secondary: '#718096',
    inverse: '#F7FAFC',
  },
  background: {
    primary: '#F5F7FA',
    secondary: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.8)',
  },
  border: {
    default: '#E2E8F0',
    subtle: 'rgba(255, 255, 255, 0.3)',
  },
};

const darkColors = {
  text: {
    primary: '#F7FAFC',
    secondary: '#A0AEC0',
    inverse: '#1A202C',
  },
  background: {
    primary: '#1A202C',
    secondary: '#2D3748',
    card: 'rgba(26, 32, 44, 0.8)',
  },
  border: {
    default: '#4A5568',
    subtle: 'rgba(255, 255, 255, 0.1)',
  },
};

export const lightTheme = { ...baseTheme, colors: lightColors };
export const darkTheme = { ...baseTheme, colors: darkColors };

export type AppTheme = typeof lightTheme;
