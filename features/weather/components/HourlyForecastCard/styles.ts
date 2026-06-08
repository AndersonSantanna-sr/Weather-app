import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      gap: 5,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: '600',
    },
    valueText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '700',
    },
  });
