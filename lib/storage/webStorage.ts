import type { StateStorage } from 'zustand/middleware';

export const webStorage: StateStorage = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    return value ?? null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};
