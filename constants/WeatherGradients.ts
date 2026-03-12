export enum WeatherCondition {
  SUNNY = 'SUNNY',
  CLOUDY = 'CLOUDY',
  RAINY = 'RAINY',
  STORMY = 'STORMY',
  SNOWY = 'SNOWY',
  FOGGY = 'FOGGY',
  CLEAR_NIGHT = 'CLEAR_NIGHT',
}

export const WEATHER_GRADIENTS = {
  [WeatherCondition.SUNNY]: {
    colors: ['#56CCF2', '#FFFFFF'],
    cloudColor: '#FFFFFF',
  },
  [WeatherCondition.CLOUDY]: {
    colors: ['#2E3A59', '#E8EEF5'],
    cloudColor: '#FFFFFF',
  },
  [WeatherCondition.RAINY]: {
    colors: ['#4A5568', '#A0AEC0'],
    cloudColor: '#FFFFFF',
  },
  [WeatherCondition.STORMY]: {
    colors: ['#1A202C', '#4A5568'],
    cloudColor: '#FFFFFF',
  },
  [WeatherCondition.SNOWY]: {
    colors: ['#B8C6DB', '#F5F7FA'],
    cloudColor: '#FFFFFF',
  },
  [WeatherCondition.FOGGY]: {
    colors: ['#8E9EAB', '#D4D9DD'],
    cloudColor: '#E8EAED',
  },
  [WeatherCondition.CLEAR_NIGHT]: {
    colors: ['#0F2027', '#2C5364'],
    cloudColor: '#203A43',
  },
} as const;
