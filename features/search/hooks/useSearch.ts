import { useQuery } from '@tanstack/react-query';
import { getForecastSearch } from '../api/searchApi';
import type { SearchLocation } from '../types/search';

export const useSearch = (query: string) => {
  return useQuery<Omit<SearchLocation, 'searchedAt'>[]>({
    queryKey: ['search', query],
    queryFn: () => getForecastSearch(query),
    enabled: query.length >= 3,
    staleTime: 30_000,
  });
};
