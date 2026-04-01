import { StateCreator } from "zustand";
import { TaskBoardState, MetadataSlice } from "@/features/taskboard/store/types";
import { Team, Category, Brand } from "@/features/taskboard/types";
import { INITIAL_TEAMS, INITIAL_BRANDS } from "@/features/taskboard/store/initial-state";
import { teamsService } from "@/features/taskboard/services/teams";
import { brandsService } from "@/features/taskboard/services/brands";
import { genId } from "@/features/taskboard/store/utils";

export const createMetadataSlice: StateCreator<
  TaskBoardState,
  [],
  [],
  MetadataSlice
> = (set) => ({
  teams: INITIAL_TEAMS,
  categories: [],
  brands: INITIAL_BRANDS,

  //  Team Logic 
  setTeams: (teams) => set({ teams }),

  fetchTeams: async () => {
    try {
      const resp = await teamsService.getAll();
      const data = Array.isArray(resp)
        ? resp
        : (resp as any)?.data ||
        (resp as any)?.teams ||
        (resp as any)?.results ||
        [];
      set({ teams: data });
    } catch {
      // API nabhaye - keep existing teams from store/localStorage
    }
  },

  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
      tasks: state.tasks.map((task) => ({
        ...task,
        promotedTeam: task.promotedTeam === id ? undefined : task.promotedTeam,
        subtasks: (task.subtasks ?? []).map((s) => ({
          ...s,
          team: s.team === id ? undefined : s.team,
        })),
      })),
    })),

  updateTeam: (id, name) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, name } : t)),
    })),

  //  Category Logic 
  addCategory: (name, color) =>
    set((state) => ({
      categories: [...state.categories, { id: genId().toString(), name, color }],
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      tasks: state.tasks.map((t) => ({
        ...t,
        categoryId: t.categoryId === id ? undefined : t.categoryId,
        subtasks: (t.subtasks ?? []).map((s) => ({
          ...s,
          categoryId: s.categoryId === id ? undefined : s.categoryId,
        })),
      })),
    })),

  updateCategory: (id, name, color) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, name, color: color ?? c.color } : c,
      ),
    })),

  //  Brand Logic 
  setBrands: (brands) => set({ brands }),

  fetchBrands: async () => {
    try {
      const resp = await brandsService.getAll();
      const data = Array.isArray(resp)
        ? resp
        : (resp as any)?.data ||
        (resp as any)?.brands ||
        (resp as any)?.results ||
        [];
      set({ brands: data });
    } catch {
      // API nabhaye - keep existin brands from local
    }
  },

  addBrand: (name) =>
    set((state) => ({
      brands: [...state.brands, { id: genId().toString(), name }],
    })),

  deleteBrand: (id) =>
    set((state) => ({
      brands: state.brands.filter((b) => b.id !== id),
      tasks: state.tasks.map((t) => ({
        ...t,
        brand: t.brand === id ? undefined : t.brand,
        subtasks: (t.subtasks ?? []).map((s) => ({
          ...s,
          brand: s.brand === id ? undefined : s.brand,
        })),
      })),
    })),

  updateBrand: (id, name) =>
    set((state) => ({
      brands: state.brands.map((b) => (b.id === id ? { ...b, name } : b)),
    })),
});
