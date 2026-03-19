import { create } from 'zustand';

interface WeatherThemeStore {
  textColor: string;
  subtextColor: string;
  setWeatherTheme: (textColor: string, subtextColor: string) => void;
}

export const useWeatherThemeStore = create<WeatherThemeStore>((set) => ({
  textColor: '#1A202C',
  subtextColor: '#4A5568',
  setWeatherTheme: (textColor, subtextColor) => set({ textColor, subtextColor }),
}));
