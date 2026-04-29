import { zustandStorage } from '@/lib/storage/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemperatureUnit, TimeFormat, WindSpeedUnit } from '../types/units';

interface SettingsStore {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  timeFormat: TimeFormat;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      temperatureUnit: TemperatureUnit.CELSIUS,
      windSpeedUnit: WindSpeedUnit.KPH,
      timeFormat: TimeFormat.H24,
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setWindSpeedUnit: (unit) => set({ windSpeedUnit: unit }),
      setTimeFormat: (format) => set({ timeFormat: format }),
    }),
    {
      name: 'settings',
      storage: zustandStorage,
    }
  )
);
