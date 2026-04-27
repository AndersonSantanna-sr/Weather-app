import type { AppTheme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    gpsLoadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a2e',
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
      width: '100%',
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
