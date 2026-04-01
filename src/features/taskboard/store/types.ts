import { Column, Task, Subtask, Id, Category, Brand, Team } from "@/features/taskboard/types";
import { INITIAL_TASKS, INITIAL_COLUMNS } from "@/features/taskboard/store/initial-state";

export interface ColumnSlice {
  columns: typeof INITIAL_COLUMNS;
  addColumn: () => void;
  addCustomColumn: (title: string, id?: Id) => void;
  deleteColumn: (id: Id) => void;
  updateColumnId: (oldId: Id, newId: Id) => void;
  updateColumnTitle: (id: Id, title: string) => void;
  reorderColumns: (activeId: Id, overId: Id) => void;
}

export interface TaskSlice {
  tasks: typeof INITIAL_TASKS;
  addTask: (
    columnId: Id,
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
    columnId: Id,
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
  updateTaskCategory: (id: Id, categoryId?: string) => void;
  updateTaskBrand: (id: Id, brand?: string) => void;
  updateTaskTeam: (id: Id, team: string) => void;
  deleteTask: (id: Id) => void;
  updateTaskColor: (id: Id, color: string) => void;
  updateTaskTitle: (id: Id, title: string) => void;
  updateTaskDifficulty: (id: Id, difficulty: number) => void;
  updateTaskDeadline: (id: Id, deadline: string) => void;
  updateTaskInitiatedBy: (id: Id, name: string) => void;
  moveTask: (activeId: Id, overId: Id, overType: "Task" | "Column") => void;
  setTasks: (tasks: Task[]) => void;
  addTaskComment: (taskId: Id, content: string) => void;
  deleteTaskComment: (taskId: Id, commentId: Id) => void;
}

export interface SubtaskSlice {
  addSubtask: (taskId: Id, title: string) => void;
  deleteSubtask: (taskId: Id, subtaskId: Id) => void;
  toggleSubtask: (taskId: Id, subtaskId: Id) => void;
  promoteSubtask: (taskId: Id, subtaskId: Id) => void;
  reattachToParent: (taskId: Id) => void;
  updateSubtask: (
    taskId: Id,
    subtaskId: Id,
    updates: Partial<Pick<Subtask, "title" | "team" | "categoryId" | "brand">>
  ) => void;
  addSubtaskComment: (taskId: Id, subtaskId: Id, content: string) => void;
  deleteSubtaskComment: (taskId: Id, subtaskId: Id, commentId: Id) => void;
}

export interface MetadataSlice {
  teams: Team[];
  categories: Category[];
  brands: Brand[];
  
  setTeams: (teams: Team[]) => void;
  fetchTeams: () => Promise<void>;
  deleteTeam: (id: string) => void;
  updateTeam: (id: string, name: string) => void;

  addCategory: (name: string, color?: string) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, name: string, color?: string) => void;

  setBrands: (brands: Brand[]) => void;
  fetchBrands: () => Promise<void>;
  addBrand: (name: string) => void;
  deleteBrand: (id: string) => void;
  updateBrand: (id: string, name: string) => void;
}

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

export interface ExportSlice {
  exportJSON: () => void;
  exportCSV: () => void;
}

export type TaskBoardState = ColumnSlice & 
  TaskSlice & 
  SubtaskSlice & 
  MetadataSlice & 
  FilterSlice & 
  ExportSlice;
