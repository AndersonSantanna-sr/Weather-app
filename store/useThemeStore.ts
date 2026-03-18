import { storage } from "@/lib";
import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme?: Theme;
  toggleTheme: () => void;
  getTheme: () => Theme | undefined;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  toggleTheme: () => {
    const currentTheme = storage.getString("theme") as Theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    storage.set("theme", newTheme);
    set({ theme: newTheme });
  },
  getTheme: () => storage.getString("theme") as Theme | undefined,
  setTheme: (theme: Theme) => {
    storage.set("theme", theme);
    set({ theme });
  },
}));
