import { zustandStorage } from '@/lib/storage/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemperatureUnit, TimeFormat, WindSpeedUnit } from '../types/units';

interface SettingsStore {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  timeFormat: TimeFormat;
  rainAlertEnabled: boolean;
  rainAlertThreshold: number;
  dailySummaryEnabled: boolean;
  temperatureAlertEnabled: boolean;
  temperatureAlertThreshold: number;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setRainAlertEnabled: (v: boolean) => void;
  setRainAlertThreshold: (v: number) => void;
  setDailySummaryEnabled: (v: boolean) => void;
  setTemperatureAlertEnabled: (v: boolean) => void;
  setTemperatureAlertThreshold: (v: number) => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      temperatureUnit: TemperatureUnit.CELSIUS,
      windSpeedUnit: WindSpeedUnit.KPH,
      timeFormat: TimeFormat.H24,
      rainAlertEnabled: false,
      rainAlertThreshold: 50,
      dailySummaryEnabled: false,
      temperatureAlertEnabled: false,
      temperatureAlertThreshold: 35,
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setWindSpeedUnit: (unit) => set({ windSpeedUnit: unit }),
      setTimeFormat: (format) => set({ timeFormat: format }),
      setRainAlertEnabled: (v) => set({ rainAlertEnabled: v }),
      setRainAlertThreshold: (v) => set({ rainAlertThreshold: v }),
      setDailySummaryEnabled: (v) => set({ dailySummaryEnabled: v }),
      setTemperatureAlertEnabled: (v) => set({ temperatureAlertEnabled: v }),
      setTemperatureAlertThreshold: (v) => set({ temperatureAlertThreshold: v }),
    }),
    {
      name: 'settings',
      storage: zustandStorage,
    }
  )
);
