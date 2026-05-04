// Mock the API before importing anything else
const mockGetForecast = jest.fn();

jest.mock('@/features/weather/api/weatherApi', () => ({
  getForecast: (...args: unknown[]) => mockGetForecast(...args),
}));

// Mock modules that might trigger scope issues
jest.mock('expo-constants', () => ({
  manifest: { extra: {} },
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForecast } from '@/features/weather/hooks/useForecast';

const mockWeatherData = {
  location: { name: 'São Paulo' },
  forecast: { forecastday: [] },
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  mockGetForecast.mockClear();
});

describe('useForecast', () => {
  it('is disabled when query is empty string', () => {
    const { result } = renderHook(() => useForecast(''), { wrapper });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockGetForecast).not.toHaveBeenCalled();
  });

  it('fetches data when query is provided', async () => {
    mockGetForecast.mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useForecast('São Paulo'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockWeatherData);
    expect(mockGetForecast).toHaveBeenCalledWith('São Paulo');
  });

  it('returns error state when API fails', async () => {
    mockGetForecast.mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() => useForecast('São Paulo'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
