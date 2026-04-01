import { StateCreator } from "zustand";
import { TaskBoardState } from "@/features/taskboard/store/types";
import { genId, reindexCols } from "@/features/taskboard/store/utils";
import { arrayMove } from "@dnd-kit/sortable";
import { INITIAL_COLUMNS } from "@/features/taskboard/store/initial-state";

export interface ColumnSlice {
  columns: typeof INITIAL_COLUMNS;
  addColumn: () => void;
  addCustomColumn: (title: string, id?: any) => void;
  deleteColumn: (id: any) => void;
  updateColumnId: (oldId: any, newId: any) => void;
  updateColumnTitle: (id: any, title: string) => void;
  reorderColumns: (activeId: any, overId: any) => void;
}

export const createColumnSlice: StateCreator<
  TaskBoardState,
  [],
  [],
  ColumnSlice
> = (set) => ({
  columns: INITIAL_COLUMNS,

  addColumn: () =>
    set((state) => ({
      columns: [
        ...state.columns,
        {
          id: genId(),
          title: `Column ${state.columns.length + 1}`,
          position: state.columns.length,
        },
      ],
    })),

  addCustomColumn: (title, id) =>
    set((state) => ({
      columns: [
        ...state.columns,
        {
          id: id || genId(),
          title,
          position: state.columns.length,
        },
      ],
    })),

  deleteColumn: (id) =>
    set((state) => ({
      columns: reindexCols(state.columns.filter((c) => c.id !== id)),
      tasks: state.tasks.filter((t) => t.columnId !== id),
    })),

  updateColumnTitle: (id, title) =>
    set((state) => ({
      columns: state.columns.map((c) => (c.id === id ? { ...c, title } : c)),
    })),

  updateColumnId: (oldId, newId) =>
    set((state) => {
      if (oldId === "prime") return {}; //prime bhaye change huna sakdaina
      if (state.columns.some((c) => c.id === newId)) return {}; //unique id huna parcha

      return {
        columns: state.columns.map((c) =>
          c.id === oldId ? { ...c, id: newId } : c,
        ),
        tasks: state.tasks.map((t) =>
          t.columnId === oldId ? { ...t, columnId: newId } : t,
        ),
      };
    }),

  reorderColumns: (activeId, overId) =>
    set((state) => {
      const from = state.columns.findIndex((c) => c.id === activeId);
      const to = state.columns.findIndex((c) => c.id === overId);
      if (from === -1 || to === -1) return {};
      return { columns: reindexCols(arrayMove(state.columns, from, to)) };
    }),
});
