import type { AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // borderWidth: 1,
      // borderColor: theme.colors.border.default,
      // borderRadius: 8,
      // paddingHorizontal: 12,
      // paddingVertical: 8,
      // marginBottom: 16,
      width: '80%',
    },
    iconContainer: { paddingHorizontal: 8 },
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
    activityIndicator: {
      marginRight: theme.spacing.sm,
    },
  });
