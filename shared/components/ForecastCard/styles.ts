import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      borderWidth: 0.6,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    containerFlat: {
      padding: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateContainer: {
      flex: 0.45,
      flexDirection: 'column',
    },
    weekdayText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.xs,
    },
    dateText: {
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing.xs,
    },
    temperatureText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    flexContainer: {
      flex: 0.275,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
  });
