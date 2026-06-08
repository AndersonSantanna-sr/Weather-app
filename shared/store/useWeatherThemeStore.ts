import { create } from 'zustand';

export interface WeatherThemeTokens {
  textColor: string;
  subtextColor: string;
  faintColor: string;
  heroText: string;
  heroSub: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  divider: string;
  chip: string;
  darkGlass: boolean;
  blurTint: 'light' | 'dark';
  gradientColors: [string, string, string];
  gradientLocations: [number, number, number];
}

interface WeatherThemeStore extends WeatherThemeTokens {
  setWeatherTheme: (tokens: WeatherThemeTokens) => void;
}

const DEFAULT_TOKENS: WeatherThemeTokens = {
  textColor: '#1B2430',
  subtextColor: 'rgba(30,41,59,0.62)',
  faintColor: 'rgba(30,41,59,0.42)',
  heroText: '#15202E',
  heroSub: 'rgba(21,32,46,0.72)',
  surface: 'rgba(255,255,255,0.50)',
  surfaceStrong: 'rgba(255,255,255,0.66)',
  border: 'rgba(255,255,255,0.6)',
  divider: 'rgba(30,41,59,0.10)',
  chip: 'rgba(255,255,255,0.45)',
  darkGlass: false,
  blurTint: 'light',
  gradientColors: ['#4FC3F0', '#9BDCF7', '#FFFFFF'],
  gradientLocations: [0, 0.46, 1],
};

export const useWeatherThemeStore = create<WeatherThemeStore>((set) => ({
  ...DEFAULT_TOKENS,
  setWeatherTheme: (tokens) => set(tokens),
}));
