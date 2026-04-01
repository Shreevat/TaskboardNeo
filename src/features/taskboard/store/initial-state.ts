import { Column, Task, Team, Brand } from "@/features/taskboard/types";
import { reindexCols, TASK_COLORS } from "@/features/taskboard/store/utils";

const now = new Date().toISOString();

export const INITIAL_COLUMNS: Column[] = reindexCols([
  { id: "prime", title: "To do", position: 0 },
  { id: "in-progress", title: "In Progress", position: 1 },
  { id: "done", title: "Done", position: 2 },
]);

export const INITIAL_TEAMS: Team[] = [
  { id: "team-1", name: "A" },
  { id: "team-2", name: "B" },
  { id: "team-3", name: "C" },
  { id: "team-4", name: "D" },
  { id: "team-5", name: "E" },
];

export const INITIAL_BRANDS: Brand[] = [
  { id: "brand-1", name: "MSMJP" },
  { id: "brand-2", name: "THK" },
  { id: "brand-3", name: "MSM" },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    columnId: "prime",
    title: "Task 1",
    position: 0,
    createdAt: now,
    updatedAt: now,
    subtasks: [],
    color: TASK_COLORS[0],
    history: [],
    promotedTaskIds: [],
    comments: [],
    difficulty: 1,
  },
  {
    id: "t2",
    columnId: "prime",
    title: "Task 2",
    position: 1,
    createdAt: now,
    updatedAt: now,
    color: TASK_COLORS[1],
    history: [],
    promotedTaskIds: [],
    comments: [],
    difficulty: 2,
    subtasks: [
      {
        id: "s1",
        title: "Input",
        completed: false,
        createdAt: now,
        history: [],
        team: "team-1",
        comments: [],
      },
      {
        id: "s2",
        title: "Spec",
        completed: false,
        createdAt: now,
        history: [],
        team: "team-2",
        comments: [],
      },
      {
        id: "s3",
        title: "Type",
        completed: false,
        createdAt: now,
        history: [],
        team: "team-3",
        comments: [],
      },
    ],
  },
  {
    id: "t3",
    columnId: "in-progress",
    title: "Task 3",
    position: 0,
    createdAt: now,
    updatedAt: now,
    subtasks: [],
    color: TASK_COLORS[3],
    history: [],
    promotedTaskIds: ["t4"],
    comments: [],
    difficulty: 3,
  },
  {
    id: "t4",
    columnId: "done",
    title: "Split Task from 3",
    position: 0,
    createdAt: now,
    updatedAt: now,
    subtasks: [],
    color: TASK_COLORS[4],
    history: [],
    promotedTaskIds: [],
    parentTaskId: "t3",
    comments: [],
  },
];
