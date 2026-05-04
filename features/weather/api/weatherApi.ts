import { api } from '@/lib/api/client';
import type { WeatherData } from '../types/weather';
/**
 *
 * @param query
 * Query parameter based on which data is sent back.It could be following:
 * - Latitude and Longitude (Decimal degree) e.g: "48.8567,2.3508"
 * - city name e.g.: "Paris"
 * - US zip e.g.: "10001"
 * - Canada postal code e.g: "G2J"
 * - metar:<metar code> e.g: "metar:EGLL"
 * - iata:<3 digit airport code> e.g: "iata:DXB"
 * - auto:ip IP lookup e.g: "auto:ip"
 * - IP address (IPv4 and IPv6 supported) e.g: "100.0.0.1"
 * - By ID returned from Search API. e.g: "id:2801268"
 * - bulk (NEW)
 * @returns WeatherData
 */
export const getForecast = async (query: string): Promise<WeatherData> => {
  const response = await api.get(`/forecast.json`, {
    params: {
      q: query,
      key: process.env.EXPO_PUBLIC_API_KEY,
      days: 7,
    },
  });
  return response.data;
};
