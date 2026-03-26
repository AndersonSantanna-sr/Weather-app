import type { AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      zIndex: 10,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      width: '100%',
    },
    label: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
    },
    // Dropdown Styles
    dropdown: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.sm,
      marginTop: 4,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      overflow: 'hidden',
      position: 'absolute',
      top: '100%',
      right: 0,
      left: 0,
    },
    optionItem: {
      backgroundColor: theme.colors.background.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.default,
    },
    optionItemSelected: {
      backgroundColor: `#dbe1e9`, //TODO: use theme color instead of hardcoded value
    },
    optionText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
    },
    optionTextSelected: {
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
  });
