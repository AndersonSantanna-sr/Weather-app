import type { AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cloudEffect: {
      position: 'absolute',
      bottom: 0,
      height: '70%',
      alignSelf: 'center',
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      paddingTop: theme.spacing.lg,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2E3A59',
      zIndex: 1,
    },
    temp: {
      fontSize: 72,
      fontWeight: 'bold',
      color: '#4A6FA5',
      marginTop: 20,
      zIndex: 1,
    },
  });
