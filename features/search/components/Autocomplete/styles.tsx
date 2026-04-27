import type { AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
    },
    iconContainer: { paddingHorizontal: theme.spacing.sm },
    input: {
      width: '100%',
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
    },
    optionText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
      paddingVertical: theme.spacing.xs,
      paddingLeft: theme.spacing.sm,
      paddingRight: theme.spacing.md,
      fontWeight: '500',
    },
    optionItem: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.default,
      backgroundColor: theme.colors.background.primary,
    },
    optionContainer: {
      position: 'absolute',
      top: 40,
      left: 0,
      right: 0,
      zIndex: 1,
      overflow: 'hidden',
    },
  });
