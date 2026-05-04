import type { AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.primary,
      flexDirection: 'column',
      paddingTop: theme.spacing.md,
    },
    autocompleteContainer: {
      flex: 1,
      left: 0,
      position: 'absolute',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      right: 0,
      top: theme.spacing.md,
      zIndex: 1,
      padding: theme.spacing.md,
    },
    contentContainer: {
      width: '100%',
      marginTop: theme.spacing.xxl * 1.5,
    },
    subtitleContainer: {
      marginBottom: theme.spacing.md,
    },
    forecastCardContainer: {
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.md,
      color: `${theme.colors.text.inverse}90`,
    },
  });
