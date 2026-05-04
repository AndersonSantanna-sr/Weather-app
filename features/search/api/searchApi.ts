import { api } from '@/lib/api/client';
import type { SearchLocation } from '../types/search';

export const getForecastSearch = async (
  query: string
): Promise<Omit<SearchLocation, 'searchedAt'>[]> => {
  const response = await api.get('/search.json', {
    params: {
      q: query,
      key: process.env.EXPO_PUBLIC_API_KEY,
    },
  });
  return response.data;
};
