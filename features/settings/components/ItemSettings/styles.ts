import type { AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    itemContainer: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xs,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    itemDescription: {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.fontSize.sm,
    },
    itemText: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.md,
    },
    itemInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      width: '50%',
    },
    itemInputContainer: {
      width: '40%',
    },
  });
