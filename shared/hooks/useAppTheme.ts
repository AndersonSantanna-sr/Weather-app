import { darkTheme, lightTheme } from '@/shared/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';

export const useAppTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  return theme === 'dark' ? darkTheme : lightTheme;
};
