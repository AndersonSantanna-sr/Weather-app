import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.background.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing.sm,
    },
    valueText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
    },
  });
