import { useQuery } from '@tanstack/react-query';
import { getForecastSearch } from '../api/searchApi';

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => getForecastSearch(query),
    enabled: query.length >= 3,
    staleTime: 30_000,
  });
};
