import { StateCreator } from "zustand";
import { TaskBoardState } from "@/features/taskboard/store/types";
import { genId, reindex, getRandomColor } from "@/features/taskboard/store/utils";
import { arrayMove } from "@dnd-kit/sortable";
import { INITIAL_TASKS } from "@/features/taskboard/store/initial-state";
import { HistoryEntry } from "@/features/taskboard/types";

export interface TaskSlice {
  tasks: typeof INITIAL_TASKS;
  addTask: (
    columnId: any,
    title?: string,
    team?: string,
    categoryId?: string,
    brand?: string,
    difficulty?: number,
    deadline?: string,
    initiatedBy?: string,
    subtasks?: string[],
  ) => void;
  addMultipleTasks: (
    columnId: any,
    tasks: {
      title: string;
      categoryId?: string;
      brand?: string;
      difficulty?: number;
      deadline?: string;
      initiatedBy?: string;
      subtasks?: string[];
    }[],
  ) => void;
  updateTaskCategory: (id: any, categoryId?: string) => void;
  updateTaskBrand: (id: any, brand?: string) => void;
  updateTaskTeam: (id: any, team: string) => void;
  deleteTask: (id: any) => void;
  updateTaskColor: (id: any, color: string) => void;
  updateTaskTitle: (id: any, title: string) => void;
  updateTaskDifficulty: (id: any, difficulty: number) => void;
  updateTaskDeadline: (id: any, deadline: string) => void;
  updateTaskInitiatedBy: (id: any, name: string) => void;
  moveTask: (activeId: any, overId: any, overType: "Task" | "Column") => void;
  setTasks: (tasks: any[]) => void;
  addTaskComment: (taskId: any, content: string) => void;
  deleteTaskComment: (taskId: any, commentId: any) => void;
}

export const createTaskSlice: StateCreator<
  TaskBoardState,
  [],
  [],
  TaskSlice
> = (set) => ({
  tasks: INITIAL_TASKS,

  setTasks: (tasks) => set({ tasks }),

  updateTaskCategory: (id: any, categoryId?: string) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              categoryId,
              updatedAt: new Date().toISOString(),
              subtasks: (t.subtasks ?? []).map((s) => ({ ...s, categoryId })),
            }
          : t,
      ),
    })),

  updateTaskBrand: (id: any, brand?: string) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              brand,
              updatedAt: new Date().toISOString(),
              subtasks: (t.subtasks ?? []).map((s) => ({ ...s, brand })),
            }
          : t,
      ),
    })),

  updateTaskTeam: (id: any, team: string) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              promotedTeam: team,
              updatedAt: new Date().toISOString(),
              subtasks: (t.subtasks ?? []).map((s) => ({ ...s, team })),
            }
          : t,
      ),
    })),

  addTask: (columnId, title, team, categoryId, brand, difficulty, deadline, initiatedBy, subtasks) =>
    set((state) => {
      const colTasks = state.tasks.filter((t) => t.columnId === columnId);
      const nowFormatted = new Date().toISOString();
      return {
        tasks: [
          ...state.tasks,
          {
            id: genId(),
            columnId,
            title: title || "",
            promotedTeam: team,
            categoryId,
            brand,
            difficulty,
            deadline,
            initiatedBy,
            position: colTasks.length,
            createdAt: nowFormatted,
            updatedAt: nowFormatted,
            subtasks: (subtasks && subtasks.length > 0
              ? subtasks
              : ["Input", "Spec", "Type"]
            ).map((c) => ({
              id: genId(),
              title: c,
              completed: false,
              createdAt: nowFormatted,
              comments: [],
              history: [
                {
                  id: genId(),
                  type: "create",
                  timestamp: nowFormatted,
                  description: "Subtask created",
                } as HistoryEntry,
              ],
            })),
            color: getRandomColor(),
            promotedTaskIds: [],
            comments: [],
            history: [
              {
                id: genId(),
                type: "create",
                timestamp: nowFormatted,
                description: "Task created",
              } as HistoryEntry,
            ],
          },
        ],
      };
    }),

  addMultipleTasks: (columnId, tasksToCreate) =>
    set((state) => {
      const nowFormatted = new Date().toISOString();
      let lastPos = state.tasks.filter((t) => t.columnId === columnId).length;

      const newTasks = tasksToCreate.map((data, idx) => ({
        id: genId(),
        columnId,
        title: data.title || "",
        categoryId: data.categoryId,
        brand: data.brand,
        difficulty: data.difficulty,
        deadline: data.deadline,
        initiatedBy: data.initiatedBy,
        position: lastPos + idx,
        createdAt: nowFormatted,
        updatedAt: nowFormatted,
        subtasks: (data.subtasks && data.subtasks.length > 0
          ? data.subtasks
          : ["Input", "Spec", "Type"]
        ).map((c) => ({
          id: genId(),
          title: c,
          completed: false,
          createdAt: nowFormatted,
          comments: [],
          history: [
            {
              id: genId(),
              type: "create",
              timestamp: nowFormatted,
              description: "Subtask created",
            } as HistoryEntry,
          ],
        })),
        color: getRandomColor(),
        promotedTaskIds: [],
        comments: [],
        history: [
          {
            id: genId(),
            type: "create",
            timestamp: nowFormatted,
            description: "Task created",
          } as HistoryEntry,
        ],
      }));

      return {
        tasks: [...state.tasks, ...newTasks],
      };
    }),

  addTaskComment: (taskId, content) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              updatedAt: new Date().toISOString(),
              comments: [
                ...(t.comments ?? []),
                {
                  id: genId(),
                  content,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : t,
      ),
    })),

  deleteTaskComment: (taskId, commentId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              updatedAt: new Date().toISOString(),
              comments: (t.comments ?? []).filter((c) => c.id !== commentId),
            }
          : t,
      ),
    })),

  updateTaskColor: (id, color) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              color,
              updatedAt: new Date().toISOString(),
              history: [
                ...(t.history ?? []),
                {
                  id: genId(),
                  type: "color_change",
                  timestamp: new Date().toISOString(),
                  description: `Color updated manually`,
                } as HistoryEntry,
              ],
            }
          : t,
      ),
    })),

  updateTaskTitle: (id, title) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, title, updatedAt: new Date().toISOString() }
          : t,
      ),
    })),

  updateTaskDifficulty: (id, difficulty) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, difficulty, updatedAt: new Date().toISOString() }
          : t,
      ),
    })),

  updateTaskDeadline: (id, deadline) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, deadline, updatedAt: new Date().toISOString() }
          : t,
      ),
    })),

  updateTaskInitiatedBy: (id, initiatedBy) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, initiatedBy, updatedAt: new Date().toISOString() }
          : t,
      ),
    })),

  deleteTask: (id) =>
    set((state) => {
      const taskToDelete = state.tasks.find((t) => t.id === id);
      let remaining = state.tasks.filter((t) => t.id !== id);

      if (taskToDelete?.parentTaskId) {
        remaining = remaining.map((t) =>
          t.id === taskToDelete.parentTaskId
            ? {
                ...t,
                promotedTaskIds: (t.promotedTaskIds ?? []).filter(
                  (pid) => pid !== id,
                ),
              }
            : t,
        );
      }

      const columnIds = [...new Set(remaining.map((t) => t.columnId))];
      return {
        tasks: columnIds.flatMap((cid) =>
          reindex(
            remaining
              .filter((t) => t.columnId === cid)
              .sort((a, b) => a.position - b.position),
          ),
        ),
      };
    }),

  moveTask: (activeId, overId, overType) =>
    set((state) => {
      const activeIdx = state.tasks.findIndex((t) => t.id === activeId);
      if (activeIdx === -1) return {};

      let updated = [...state.tasks];
      const task = { ...updated[activeIdx] };
      const fromColId = task.columnId;

      if (overType === "Task") {
        const overIdx = updated.findIndex((t) => t.id === overId);
        if (overIdx === -1) return {};
        task.columnId = updated[overIdx].columnId;
        updated[activeIdx] = task;
        updated = arrayMove(updated, activeIdx, overIdx);
      } else {
        task.columnId = overId;
        updated[activeIdx] = task;
      }

      const finalTask = updated.find((t) => t.id === activeId);
      if (finalTask && finalTask.columnId !== fromColId) {
        const nowFormatted = new Date().toISOString();
        const fromCol = state.columns.find((c) => c.id === fromColId);
        const toCol = state.columns.find((c) => c.id === finalTask.columnId);

        finalTask.updatedAt = nowFormatted;
        finalTask.history = [
          ...(finalTask.history ?? []),
          {
            id: genId(),
            type: "move",
            fromColumnId: fromColId,
            toColumnId: finalTask.columnId,
            timestamp: nowFormatted,
            description: `Moved from "${fromCol?.title ?? "Unknown"}" to "${toCol?.title ?? "Unknown"}"`,
          } as HistoryEntry,
        ];
      }

      const columnIds = [...new Set(updated.map((t) => t.columnId))];
      return {
        tasks: columnIds.flatMap((cid) =>
          reindex(
            updated
              .filter((t) => t.columnId === cid)
              .sort((a, b) => a.position - b.position),
          ),
        ),
      };
    }),
});
