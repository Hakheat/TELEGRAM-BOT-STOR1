import { create } from "zustand";

interface CustomColorState {
  sidebarBg: string;
  headerBg: string;
  setSidebarBg: (color: string) => void;
  setHeaderBg: (color: string) => void;
  resetColors: () => void;
}

const getStoredColor = (key: string): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) || "";
  }
  return "";
};

export const useCustomColorStore = create<CustomColorState>((set) => ({
  sidebarBg: getStoredColor("custom_sidebar_bg"),
  headerBg: getStoredColor("custom_header_bg"),
  setSidebarBg: (color: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_sidebar_bg", color);
    }
    set({ sidebarBg: color });
  },
  setHeaderBg: (color: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_header_bg", color);
    }
    set({ headerBg: color });
  },
  resetColors: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("custom_sidebar_bg");
      localStorage.removeItem("custom_header_bg");
    }
    set({ sidebarBg: "", headerBg: "" });
  },
}));
