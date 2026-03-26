import { create } from 'zustand';
import { TemperatureUnit } from '../types/units';

type Theme = 'light' | 'dark';

interface SettingsStore {
  theme?: Theme;
  temperatureUnit: TemperatureUnit;
  locationServicesEnabled: boolean;
  hasHydrated: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setLocationServicesEnabled: (enabled: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSettings = create<SettingsStore>()(
  // persist(
  //   (set, get) => ({
  //     theme: get()?.theme || 'light',
  //     temperatureUnit: TemperatureUnit.CELSIUS,
  //     locationServicesEnabled: false,
  //     toggleTheme: () => {
  //       const currentTheme = get().theme;
  //       const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  //       set({ theme: newTheme });
  //     },
  //     setTheme: (theme: Theme) => set({ theme }),
  //     setTemperatureUnit: (unit: TemperatureUnit) => set({ temperatureUnit: unit }),
  //     setLocationServicesEnabled: (enabled: boolean) => set({ locationServicesEnabled: enabled }),
  //     setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
  //     hasHydrated: false,
  //   }),
  //   {
  //     name: 'settings',
  //     storage: zustandStorage,
  //     onRehydrateStorage: () => (state) => {
  //       state?.setHasHydrated(true);
  //     },
  //   }
  // )
  (set, get) => ({
    theme: get()?.theme || 'light',
    temperatureUnit: TemperatureUnit.CELSIUS,
    locationServicesEnabled: false,
    toggleTheme: () => {
      const currentTheme = get().theme;
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      set({ theme: newTheme });
    },
    setTheme: (theme: Theme) => set({ theme }),
    setTemperatureUnit: (unit: TemperatureUnit) => set({ temperatureUnit: unit }),
    setLocationServicesEnabled: (enabled: boolean) => set({ locationServicesEnabled: enabled }),
    setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
    hasHydrated: false,
  })
);
