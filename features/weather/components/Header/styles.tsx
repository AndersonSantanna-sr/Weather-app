import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingBottom: theme.spacing.md,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    glassButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 0.6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hero: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    cityName: {
      fontSize: 26,
      fontWeight: '600',
      letterSpacing: -0.3,
    },
    dateText: {
      fontSize: 14,
      fontWeight: '500',
      marginTop: 3,
    },
    iconContainer: {
      marginTop: theme.spacing.xs,
      marginBottom: -theme.spacing.xs,
    },
    temperature: {
      fontSize: 80,
      fontWeight: '200',
      lineHeight: 88,
      letterSpacing: -3,
    },
    conditionLabel: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 2,
    },
    hiLo: {
      fontSize: 15,
      fontWeight: '500',
      marginTop: 3,
    },
  });
