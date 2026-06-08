import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    sectionLabel: {
      fontSize: 12.5,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: theme.spacing.sm,
    },
    surface: {
      borderRadius: theme.borderRadius.md,
      borderWidth: 0.6,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 13,
      paddingHorizontal: theme.spacing.md,
    },
    dayBlock: {
      flex: 1,
      flexDirection: 'column',
    },
    dayText: {
      fontSize: 16,
      fontWeight: '600',
    },
    dateText: {
      fontSize: 12,
      marginTop: 2,
    },
    iconBlock: {
      width: 44,
      alignItems: 'center',
    },
    popText: {
      flex: 1,
      fontSize: 12.5,
      fontWeight: '600',
      textAlign: 'left',
      paddingLeft: theme.spacing.sm,
    },
    loTemp: {
      fontSize: 16,
      fontWeight: '600',
      marginRight: theme.spacing.md,
    },
    hiTemp: {
      fontSize: 16,
      fontWeight: '700',
    },
  });
