import { StateCreator } from "zustand";
import { TaskBoardState } from "@/features/taskboard/store/types";
import { genId } from "@/features/taskboard/store/utils";
import { HistoryEntry, Subtask, Task } from "@/features/taskboard/types";

export interface SubtaskSlice {
  addSubtask: (taskId: any, title: string) => void;
  deleteSubtask: (taskId: any, subtaskId: any) => void;
  toggleSubtask: (taskId: any, subtaskId: any) => void;
  promoteSubtask: (taskId: any, subtaskId: any) => void;
  reattachToParent: (taskId: any) => void;
  updateSubtask: (
    taskId: any,
    subtaskId: any,
    updates: Partial<
      Pick<Subtask, "title" | "team" | "categoryId" | "brand">
    >,
  ) => void;
  addSubtaskComment: (taskId: any, subtaskId: any, content: string) => void;
  deleteSubtaskComment: (taskId: any, subtaskId: any, commentId: any) => void;
}

export const createSubtaskSlice: StateCreator<
  TaskBoardState,
  [],
  [],
  SubtaskSlice
> = (set) => ({
  addSubtask: (taskId, title) =>
    set((state) => {
      const nowFormatted = new Date().toISOString();
      const subtaskId = genId();
      return {
        tasks: state.tasks.map((t) =>
          t.id !== taskId
            ? t
            : {
                ...t,
                updatedAt: nowFormatted,
                history: [
                  ...(t.history ?? []),
                  {
                    id: genId(),
                    type: "subtask_add",
                    timestamp: nowFormatted,
                    description: `Added subtask: "${title}"`,
                  } as HistoryEntry,
                ],
                subtasks: [
                  ...(t.subtasks ?? []),
                  {
                    id: subtaskId,
                    title,
                    completed: false,
                    createdAt: nowFormatted,
                    categoryId: t.categoryId,
                    brand: t.brand,
                    comments: [],
                    history: [
                      {
                        id: genId(),
                        type: "create",
                        timestamp: nowFormatted,
                        description: "Subtask created",
                      } as HistoryEntry,
                    ],
                  } satisfies Subtask,
                ],
              },
        ),
      };
    }),

  addSubtaskComment: (taskId, subtaskId, content) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id !== taskId
          ? t
          : {
              ...t,
              updatedAt: new Date().toISOString(),
              subtasks: (t.subtasks ?? []).map((s) =>
                s.id !== subtaskId
                  ? s
                  : {
                      ...s,
                      comments: [
                        ...(s.comments ?? []),
                        {
                          id: genId(),
                          content,
                          createdAt: new Date().toISOString(),
                        },
                      ],
                    },
              ),
            },
      ),
    })),

  deleteSubtaskComment: (taskId, subtaskId, commentId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id !== taskId
          ? t
          : {
              ...t,
              updatedAt: new Date().toISOString(),
              subtasks: (t.subtasks ?? []).map((s) =>
                s.id !== subtaskId
                  ? s
                  : {
                      ...s,
                      comments: (s.comments ?? []).filter(
                        (c) => c.id !== commentId,
                      ),
                    },
              ),
            },
      ),
    })),

  deleteSubtask: (taskId, subtaskId) =>
    set((state) => {
      const nowFormatted = new Date().toISOString();
      const parent = state.tasks.find((t) => t.id === taskId);
      const subtask = parent?.subtasks.find((s) => s.id === subtaskId);

      return {
        tasks: state.tasks.map((t) =>
          t.id !== taskId
            ? t
            : {
                ...t,
                updatedAt: nowFormatted,
                history: [
                  ...(t.history ?? []),
                  {
                    id: genId(),
                    type: "subtask_delete",
                    timestamp: nowFormatted,
                    description: `Deleted subtask: "${subtask?.title ?? "unknown"}"`,
                  } as HistoryEntry,
                ],
                subtasks: (t.subtasks ?? []).filter((s) => s.id !== subtaskId),
              },
        ),
      };
    }),

  toggleSubtask: (taskId, subtaskId) =>
    set((state) => {
      const nowFormatted = new Date().toISOString();
      const parent = state.tasks.find((t) => t.id === taskId);
      const subtask = parent?.subtasks.find((s) => s.id === subtaskId);

      return {
        tasks: state.tasks.map((t) =>
          t.id !== taskId
            ? t
            : {
                ...t,
                updatedAt: nowFormatted,
                history: [
                  ...(t.history ?? []),
                  {
                    id: genId(),
                    type: "subtask_toggle",
                    timestamp: nowFormatted,
                    description: `${!subtask?.completed ? "Completed" : "Unchecked"} subtask: "${subtask?.title ?? "unknown"}"`,
                  } as HistoryEntry,
                ],
                subtasks: (t.subtasks ?? []).map((s) =>
                  s.id !== subtaskId
                    ? s
                    : {
                        ...s,
                        completed: !s.completed,
                        history: [
                          ...(s.history ?? []),
                          {
                            id: genId(),
                            type: "subtask_toggle",
                            timestamp: nowFormatted,
                            description: !s.completed
                              ? "Marked as complete"
                              : "Marked as incomplete",
                          } as HistoryEntry,
                        ],
                      },
                ),
              },
        ),
      };
    }),

  promoteSubtask: (taskId, subtaskId) =>
    set((state) => {
      const parentTask = state.tasks.find((t) => t.id === taskId);
      if (!parentTask) return {};

      const subtask = (parentTask.subtasks ?? []).find(
        (s) => s.id === subtaskId,
      );
      if (!subtask) return {};

      const targetColId = parentTask.columnId;

      const tasksWithoutSub = state.tasks.map((t) =>
        t.id !== taskId
          ? t
          : {
              ...t,
              subtasks: (t.subtasks ?? []).filter((s) => s.id !== subtaskId),
            },
      );

      const colTasks = tasksWithoutSub.filter(
        (t) => t.columnId === targetColId,
      );
      const nowFormatted = new Date().toISOString();
      const newTaskId = genId();

      const newTask: Task = {
        id: newTaskId,
        columnId: targetColId,
        title: subtask.title,
        position: colTasks.length,
        createdAt: subtask.createdAt,
        updatedAt: nowFormatted,
        subtasks: [],
        parentTaskId: taskId,
        promotedTaskIds: [],
        color: parentTask.color,
        promotedTeam: subtask.team,
        categoryId: subtask.categoryId,
        brand: subtask.brand,
        comments: subtask.comments ?? [],
        history: [
          ...(subtask.history ?? []),
          {
            id: genId(),
            type: "promote",
            timestamp: nowFormatted,
            description: `Task split from parent: "${parentTask.title}"`,
          } as HistoryEntry,
        ],
      };

      const tasksWithParentUpdate = tasksWithoutSub.map((t) =>
        t.id === taskId
          ? {
              ...t,
              updatedAt: nowFormatted,
              promotedTaskIds: [...(t.promotedTaskIds ?? []), newTaskId],
              history: [
                ...(t.history ?? []),
                {
                  id: genId(),
                  type: "subtask_promote",
                  timestamp: nowFormatted,
                  description: `Split subtask "${subtask.title}" to new task`,
                } as HistoryEntry,
              ],
            }
          : t,
      );

      return { tasks: [...tasksWithParentUpdate, newTask] };
    }),

  reattachToParent: (taskId) =>
    set((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task || !task.parentTaskId) return {};

      const parent = state.tasks.find((t) => t.id === task.parentTaskId);
      if (!parent) return {};

      const tasksWithoutPromoted = state.tasks.filter((t) => t.id !== taskId);
      const nowFormatted = new Date().toISOString();
      const restoredSubtask: Subtask = {
        id: genId(),
        title: task.title || "",
        completed: false,
        createdAt: task.createdAt,
        team: task.promotedTeam,
        categoryId: task.categoryId,
        brand: task.brand,
        comments: task.comments ?? [],
        history: [
          ...(task.history ?? []),
          {
            id: genId(),
            type: "subtask_reattach",
            timestamp: nowFormatted,
            description: `Merged subtask back into main task`,
          } as HistoryEntry,
        ],
      };

      return {
        tasks: tasksWithoutPromoted.map((t) =>
          t.id !== task.parentTaskId
            ? t
            : {
                ...t,
                updatedAt: nowFormatted,
                history: [
                  ...(t.history ?? []),
                  {
                    id: genId(),
                    type: "subtask_reattach",
                    timestamp: nowFormatted,
                    description: `Merged  subtask "${task.title}" back into main task`,
                  } as HistoryEntry,
                ],
                subtasks: [...(t.subtasks ?? []), restoredSubtask],
                promotedTaskIds: (t.promotedTaskIds ?? []).filter(
                  (pid) => pid !== taskId,
                ),
              },
        ),
      };
    }),
  updateSubtask: (taskId: any, subtaskId: any, updates: any) =>
    set((state) => {
      const nowFormatted = new Date().toISOString();
      return {
        tasks: state.tasks.map((t) =>
          t.id !== taskId
            ? t
            : {
                ...t,
                updatedAt: nowFormatted,
                subtasks: (t.subtasks ?? []).map((s) =>
                  s.id !== subtaskId ? s : { ...s, ...updates },
                ),
              },
        ),
      };
    }),
});
