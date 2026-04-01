import { StateCreator } from "zustand";
import { TaskBoardState } from "@/features/taskboard/store/types";
import { Task } from "@/features/taskboard/types";

export interface FilterSlice {
  searchQuery: string;
  selectedTeams: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  setSearchQuery: (query: string) => void;
  setSelectedTeams: (teams: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedBrands: (brands: string[]) => void;
  clearFilters: () => void;
  isMinimalMode: boolean;
  toggleMinimalMode: () => void;
}

export const createFilterSlice: StateCreator<
  TaskBoardState,
  [],
  [],
  FilterSlice
> = (set) => ({
  searchQuery: "",
  selectedTeams: [],
  selectedCategories: [],
  selectedBrands: [],
  isMinimalMode: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTeams: (teams) => set({ selectedTeams: teams }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSelectedBrands: (brands) => set({ selectedBrands: brands }),
  clearFilters: () => 
    set({ 
      searchQuery: "", 
      selectedTeams: [], 
      selectedCategories: [], 
      selectedBrands: [] 
    }),
  toggleMinimalMode: () => set((s) => ({ isMinimalMode: !s.isMinimalMode })),
});

export function filterTask(
  task: Task,
  searchQuery: string,
  selectedTeams: string[],
  selectedCategories: string[],
  selectedBrands: string[],
) {
  const q = searchQuery.toLowerCase();

  const searchMatch =
    !q ||
    (task.title || "").toLowerCase().includes(q) ||
    task.subtasks?.some((s) => s.title.toLowerCase().includes(q));

  if (!searchMatch) return false;

  // Category filter
  const categoryMatch =
    selectedCategories.length === 0 ||
    (task.categoryId && selectedCategories.includes(task.categoryId)) ||
    task.subtasks?.some(
      (s) => s.categoryId && selectedCategories.includes(s.categoryId),
    );

  if (!categoryMatch) return false;

  // Team filters
  const teamMatch =
    selectedTeams.length === 0 ||
    (task.promotedTeam && selectedTeams.includes(task.promotedTeam)) ||
    task.subtasks?.some((s) => s.team && selectedTeams.includes(s.team));

  if (!teamMatch) return false;

  // Brand Filter
  const brandMatch =
    selectedBrands.length === 0 ||
    (task.brand && selectedBrands.includes(task.brand)) ||
    task.subtasks?.some((s) => s.brand && selectedBrands.includes(s.brand));

  if (!brandMatch) return false;

  return true;
}
