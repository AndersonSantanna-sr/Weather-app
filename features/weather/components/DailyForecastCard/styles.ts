import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      // borderWidth: 1,
      borderColor: theme.colors.border.default,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateContainer: {
      flex: 0.35,
      flexDirection: 'column',
    },
    weekdayText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.md,
    },
    dateText: {
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing.sm,
    },
    temperatureText: {
      flex: 0.3,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    flexContainer: {
      flex: 0.35,
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
  });
