import { darkTheme, lightTheme } from '@/shared/constants/theme';
import { useSettings } from '../store/useSettings';

export const useAppTheme = () => {
  const theme = useSettings((state) => state.theme);
  return theme === 'dark' ? darkTheme : lightTheme;
};
