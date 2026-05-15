"use client";

import { create } from "zustand";

type UIState = {
  collapsed: boolean;
  darkMode: boolean;
  globalSearch: string;
  mobileMenuOpen: boolean;
  setCollapsed: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setGlobalSearch: (value: string) => void;
  setMobileMenuOpen: (value: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  collapsed: false,
  darkMode: false,
  globalSearch: "",
  mobileMenuOpen: false,
  setCollapsed: (collapsed) => set({ collapsed }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setGlobalSearch: (globalSearch) => set({ globalSearch }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen })
}));
