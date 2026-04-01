import { create } from "zustand";
import type { ResumeTemplate } from "../data/templates";

export type FilterCategory = "All" | "ATS Friendly" | "Professional" | "Creative" | "Minimal";

interface TemplateStore {
  selectedTemplate: ResumeTemplate | null;
  filters: FilterCategory;
  searchQuery: string;
  loadingState: boolean;
  favorites: string[];
  recentlyUsed: string[];
  setSelectedTemplate: (template: ResumeTemplate) => void;
  setFilters: (filter: FilterCategory) => void;
  setSearchQuery: (value: string) => void;
  setLoadingState: (value: boolean) => void;
  toggleFavorite: (templateId: string) => void;
}

const recentLimit = 8;

export const useTemplateStore = create<TemplateStore>((set) => ({
  selectedTemplate: null,
  filters: "All",
  searchQuery: "",
  loadingState: false,
  favorites: [],
  recentlyUsed: [],
  setSelectedTemplate: (template) =>
    set((state) => {
      const nextRecent = [template.id, ...state.recentlyUsed.filter((id) => id !== template.id)].slice(
        0,
        recentLimit
      );
      return {
        selectedTemplate: template,
        recentlyUsed: nextRecent
      };
    }),
  setFilters: (filters) => set({ filters }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setLoadingState: (loadingState) => set({ loadingState }),
  toggleFavorite: (templateId) =>
    set((state) => ({
      favorites: state.favorites.includes(templateId)
        ? state.favorites.filter((id) => id !== templateId)
        : [...state.favorites, templateId]
    }))
}));