import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    contentContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing.sm,
    },
    valueText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
    },
  });
