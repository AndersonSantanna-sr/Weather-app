import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    sectionLabel: {
      fontSize: 12.5,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: theme.spacing.sm,
    },
    card: {
      borderRadius: theme.borderRadius.md,
      borderWidth: 0.6,
      overflow: 'hidden',
    },
    listContentContainer: {
      paddingVertical: theme.spacing.xs,
    },
    verticalDivider: {
      width: 0.6,
      marginVertical: theme.spacing.sm,
    },
  });
