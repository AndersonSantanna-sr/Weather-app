import { useQuery } from '@tanstack/react-query';
import { getForecast } from '../api/weatherApi';

export const useForecast = (query: string) => {
  return useQuery({
    queryKey: ['forecast', query],
    queryFn: () => getForecast(query),
    enabled: !!query,
  });
};
