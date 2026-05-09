"use client";

import { create } from "zustand";

type UIState = {
  collapsed: boolean;
  darkMode: boolean;
  globalSearch: string;
  setCollapsed: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setGlobalSearch: (value: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  collapsed: false,
  darkMode: false,
  globalSearch: "",
  setCollapsed: (collapsed) => set({ collapsed }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setGlobalSearch: (globalSearch) => set({ globalSearch })
}));
