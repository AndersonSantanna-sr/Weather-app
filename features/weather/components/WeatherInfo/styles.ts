import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'stretch',
      borderRadius: theme.borderRadius.md,
      borderWidth: 0.6,
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    metric: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xs,
      gap: 5,
    },
    label: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    value: {
      fontSize: 20,
      fontWeight: '600',
    },
    sub: {
      fontSize: 12,
    },
    divider: {
      width: 0.6,
      marginVertical: theme.spacing.md,
    },
  });
