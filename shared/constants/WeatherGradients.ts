export enum WeatherCondition {
  SUNNY = 'SUNNY',
  CLOUDY = 'CLOUDY',
  RAINY = 'RAINY',
  STORMY = 'STORMY',
  SNOWY = 'SNOWY',
  FOGGY = 'FOGGY',
  CLEAR_NIGHT = 'CLEAR_NIGHT',
  DRIZZLE = 'DRIZZLE',
}

export type WeatherGradientConfig = {
  colors: [string, string, string];
  locations: [number, number, number];
  darkGlass: boolean;
  blurTint: 'light' | 'dark';
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
};

const LIGHT_GLASS = {
  darkGlass: false,
  blurTint: 'light' as const,
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
};

const DARK_GLASS = {
  darkGlass: true,
  blurTint: 'dark' as const,
  textColor: 'rgba(255,255,255,0.96)',
  subtextColor: 'rgba(255,255,255,0.62)',
  faintColor: 'rgba(255,255,255,0.40)',
  heroText: '#FFFFFF',
  heroSub: 'rgba(255,255,255,0.78)',
  surface: 'rgba(28,30,44,0.34)',
  surfaceStrong: 'rgba(34,37,54,0.50)',
  border: 'rgba(255,255,255,0.16)',
  divider: 'rgba(255,255,255,0.12)',
  chip: 'rgba(255,255,255,0.14)',
};

export const WEATHER_GRADIENTS: Record<WeatherCondition, WeatherGradientConfig> = {
  [WeatherCondition.SUNNY]: {
    colors: ['#4FC3F0', '#9BDCF7', '#FFFFFF'],
    locations: [0, 0.46, 1],
    ...LIGHT_GLASS,
  },
  [WeatherCondition.CLOUDY]: {
    colors: ['#2E3A59', '#697999', '#E8EEF5'],
    locations: [0, 0.46, 1],
    ...LIGHT_GLASS,
  },
  [WeatherCondition.RAINY]: {
    colors: ['#46536A', '#6B7889', '#A6B2C2'],
    locations: [0, 0.46, 1],
    ...LIGHT_GLASS,
  },
  [WeatherCondition.STORMY]: {
    colors: ['#171C26', '#2A3340', '#46515F'],
    locations: [0, 0.46, 1],
    ...DARK_GLASS,
  },
  [WeatherCondition.SNOWY]: {
    colors: ['#B3C2D8', '#D2DCE9', '#F5F7FA'],
    locations: [0, 0.46, 1],
    ...LIGHT_GLASS,
  },
  [WeatherCondition.FOGGY]: {
    colors: ['#8E9EAB', '#B2BCC5', '#D7DCDF'],
    locations: [0, 0.46, 1],
    ...LIGHT_GLASS,
  },
  [WeatherCondition.CLEAR_NIGHT]: {
    colors: ['#070B22', '#121A47', '#243574'],
    locations: [0, 0.46, 1],
    ...DARK_GLASS,
  },
  [WeatherCondition.DRIZZLE]: {
    colors: ['#46536A', '#6B7889', '#A6B2C2'],
    locations: [0, 0.46, 1],
    ...LIGHT_GLASS,
  },
};
