import { type AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: theme.spacing.lg,
      left: 0,
      right: 0,
      alignItems: 'flex-start',
    },
    weatherIconContainer: {
      position: 'absolute',
      top: theme.spacing.xxl,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: 'bold',
      color: 'white',
    },
    menuContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: theme.spacing.md,
    },
    temp: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: 'bold',
      color: 'white',
      zIndex: 1,
    },
    description: {
      fontSize: theme.typography.fontSize.sm,
      color: 'white',
    },
  });
