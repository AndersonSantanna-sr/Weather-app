import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    separator: { width: theme.spacing.sm },
    listContentContainer: { paddingBottom: theme.spacing.md },
  });
