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

export const WEATHER_GRADIENTS = {
  [WeatherCondition.SUNNY]: {
    colors: ['#56CCF2', '#FFFFFF'],
    cloudColor: '#FFFFFF',
    blurTint: 'light',
    textColor: '#1B4F72',
    subtextColor: '#2E86C1',
  },
  [WeatherCondition.CLOUDY]: {
    colors: ['#2E3A59', '#E8EEF5'],
    cloudColor: '#FFFFFF',
    blurTint: 'light',
    textColor: '#1C2E4A',
    subtextColor: '#4A6080',
  },
  [WeatherCondition.RAINY]: {
    colors: ['#4A5568', '#A0AEC0'],
    cloudColor: '#FFFFFF',
    blurTint: 'light',
    textColor: '#2D3F55',
    subtextColor: '#506070',
  },
  [WeatherCondition.STORMY]: {
    colors: ['#1A202C', '#4A5568'],
    cloudColor: '#FFFFFF',
    blurTint: 'light',
    textColor: '#1A2A3A',
    subtextColor: '#3D5166',
  },
  [WeatherCondition.SNOWY]: {
    colors: ['#B8C6DB', '#F5F7FA'],
    cloudColor: '#FFFFFF',
    blurTint: 'light',
    textColor: '#2E4057',
    subtextColor: '#5B7A99',
  },
  [WeatherCondition.FOGGY]: {
    colors: ['#8E9EAB', '#D4D9DD'],
    cloudColor: '#E8EAED',
    blurTint: 'light',
    textColor: '#3D4852',
    subtextColor: '#6B7A85',
  },
  [WeatherCondition.CLEAR_NIGHT]: {
    colors: ['#0A0E27', '#1B2A6B'],
    cloudColor: '#203A43',
    blurTint: 'light',
    textColor: '#0D2137',
    subtextColor: '#2C5364',
  },
  [WeatherCondition.DRIZZLE]: {
    colors: ['#4A5568', '#A0AEC0'],
    cloudColor: '#FFFFFF',
    blurTint: 'light',
    textColor: '#2D3F55',
    subtextColor: '#506070',
  },
} as const;
