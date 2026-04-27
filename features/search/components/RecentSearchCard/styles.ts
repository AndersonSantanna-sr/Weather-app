import type { AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    loading: {
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    errorCard: {
      padding: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    errorLeft: {
      flex: 0.55,
      flexDirection: 'column',
    },
    errorName: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.xs,
    },
    errorSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing.xs,
    },
    errorTemp: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
    retryButton: {
      position: 'absolute',
      top: theme.spacing.xs + 2,
      right: theme.spacing.xl + theme.spacing.md,
      padding: theme.spacing.xs,
    },
    removeButton: {
      position: 'absolute',
      top: theme.spacing.xs + 2,
      right: theme.spacing.xs + 2,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dialog: {
      width: '80%',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background.primary,
    },
    dialogTitle: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.xs,
      color: theme.colors.text.primary,
    },
    dialogMessage: {
      fontSize: theme.typography.fontSize.sm,
      marginBottom: theme.spacing.lg,
      color: theme.colors.text.secondary,
    },
    dialogActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: theme.spacing.sm,
    },
    dialogButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    dialogCancelText: {
      color: theme.colors.text.secondary,
    },
    dialogButtonConfirm: {
      backgroundColor: '#e53935',
      borderColor: '#e53935',
    },
    dialogButtonConfirmText: {
      color: theme.colors.text.inverse,
      fontWeight: theme.typography.fontWeight.bold,
    },
  });
