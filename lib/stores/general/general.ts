import { create } from "zustand";

interface Breadcrumb {
    title: string;
    subtitle: string;
}

type Theme = "light" | "dark";

interface GeneralState {
    breadcrumb: Breadcrumb;
    theme: Theme;
    setBreadcrumb: (breadcrumb: Breadcrumb) => void;
    setTheme: (theme: Theme) => void;
}

export const useGeneralStore = create<GeneralState>((set) => ({
  breadcrumb: {
    title: "",
    subtitle: "",
  },
  theme: "light",
  setBreadcrumb: (breadcrumb) => set({ breadcrumb }),
  setTheme: (theme) => set({ theme }),
}));