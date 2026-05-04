import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';

import { storage as mmkvStorage } from './mmkv';
import { webStorage } from './webStorage';

const mmkvStateStorage: StateStorage = {
  getItem: (name) => mmkvStorage.getString(name) ?? null,
  setItem: (name, value) => mmkvStorage.set(name, value),
  removeItem: (name) => mmkvStorage.remove(name),
};

const stateStorage: StateStorage = Platform.OS === 'web' ? webStorage : mmkvStateStorage;

export const zustandStorage = createJSONStorage(() => stateStorage);
