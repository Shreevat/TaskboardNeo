import { Column, Task } from "@/features/taskboard/types";

let idCounter = Date.now();

export const genId = () => `id-${++idCounter}`;

export function reindex(tasks: Task[]): Task[] {
  return tasks.map((t, i) => ({ ...t, position: i }));
}

export function reindexCols(cols: Column[]): Column[] {
  return cols.map((c, i) => ({ ...c, position: i }));
}

export const TASK_COLORS = [
  "#ffffff", // pure white
  "#f8fafc", // slate 50
  "#f1f5f9", // slate 100
  "#f9fafb", // gray 50
  "#f0f9ff", // sky 50
  "#f0fdf4", // green 50
  "#fef2f2", // rose 50
  "#fffbeb", // amber 50
];

export const getRandomColor = () =>
  TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)];


