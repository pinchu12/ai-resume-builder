import { create } from "zustand";
import type { ResumeTemplate } from "../data/templates";

export type FilterCategory = "All" | "ATS Friendly" | "Professional" | "Creative" | "Minimal";
export type RendererTemplateId = "classic" | "professional" | "ats";

export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  summary?: string;
  skills?: string;
  experience?: string;
  education?: string;
  photoPreview?: string | null;
}

const resolveRendererTemplateId = (template: ResumeTemplate): RendererTemplateId => {
  if (template.category === "ATS Friendly") return "ats";
  if (template.category === "Professional") return "professional";
  return "classic";
};

interface TemplateStore {
  selectedTemplateId: RendererTemplateId;
  selectedTemplate: ResumeTemplate | null;
  resumeData: ResumeData;
  filters: FilterCategory;
  searchQuery: string;
  loadingState: boolean;
  favorites: string[];
  recentlyUsed: string[];
  setSelectedTemplateId: (templateId: RendererTemplateId) => void;
  setSelectedTemplate: (template: ResumeTemplate) => void;
  setResumeData: (data: ResumeData) => void;
  setFilters: (filter: FilterCategory) => void;
  setSearchQuery: (value: string) => void;
  setLoadingState: (value: boolean) => void;
  toggleFavorite: (templateId: string) => void;
}

const recentLimit = 8;

export const useTemplateStore = create<TemplateStore>((set) => ({
  selectedTemplateId: "classic",
  selectedTemplate: null,
  resumeData: {},
  filters: "All",
  searchQuery: "",
  loadingState: false,
  favorites: [],
  recentlyUsed: [],
  setSelectedTemplateId: (selectedTemplateId) => set({ selectedTemplateId }),
  setSelectedTemplate: (template) =>
    set((state) => {
      const nextRecent = [template.id, ...state.recentlyUsed.filter((id) => id !== template.id)].slice(
        0,
        recentLimit
      );
      return {
        selectedTemplateId: resolveRendererTemplateId(template),
        selectedTemplate: template,
        recentlyUsed: nextRecent
      };
    }),
  setResumeData: (resumeData) => set({ resumeData }),
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