import { create } from 'zustand';
import type { WeatherData } from '../types/weather';

interface WeatherForecast {
  weatherData?: WeatherData;
  setWeatherData: (weatherData: WeatherData) => void;
}

export const useWeatherForecast = create<WeatherForecast>()((set) => ({
  weatherData: undefined,
  setWeatherData: (weatherData: WeatherData) => set({ weatherData }),
}));
