export type Id = string | number;

export interface HistoryEntry {
  id: string;
  type:
    | "create"
    | "move"
    | "promote"
    | "color_change"
    | "subtask_add"
    | "subtask_delete"
    | "subtask_toggle"
    | "subtask_promote"
    | "subtask_reattach"
    | "team_change";
  fromColumnId?: Id;
  toColumnId?: Id;
  timestamp: string;
  description: string;
}

export interface Comment {
  id: Id;
  content: string;
  createdAt: string;
}

export interface Subtask {
  id: Id;
  title: string;
  completed: boolean;
  createdAt: string;
  history: HistoryEntry[];
  team?: string;
  categoryId?: string;
  brand?: string;
  comments: Comment[];
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Task {
  id: Id;
  columnId: Id;
  title?: string;
  position: number;
  createdAt: string;
  updatedAt: string; //  mod date
  subtasks: Subtask[];
  parentTaskId?: Id; //  if promoted from a subtask? yo rakhne
  promotedTaskIds: Id[]; // jugaad to track if subtask exist, yo array ma thapdine, subtask array bata ekchoti nikalera
  color: string;
  history: HistoryEntry[]; // Change Logs
  promotedTeam?: string; // only for promoted subtasks
  categoryId?: string;
  brand?: string;
  comments: Comment[];
  difficulty?: number;
  deadline?: string;
  initiatedBy?: string;
}

export interface Column {
  id: Id;
  title: string;
  position: number;
}
