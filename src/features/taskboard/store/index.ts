import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TaskBoardState } from "@/features/taskboard/store/types";
import { createColumnSlice } from "@/features/taskboard/store/column";
import { createTaskSlice } from "@/features/taskboard/store/task";
import { createSubtaskSlice } from "@/features/taskboard/store/subtask";
import { createMetadataSlice } from "@/features/taskboard/store/metadata";
import { createFilterSlice, filterTask } from "@/features/taskboard/store/filter";
export * from "@/features/taskboard/store/utils";
export * from "@/features/taskboard/store/types";
export { filterTask };

export const useTaskBoardStore = create<TaskBoardState>()(
  persist(
    (set, get, api) => ({
      ...createColumnSlice(set, get, api),
      ...createTaskSlice(set, get, api),
      ...createSubtaskSlice(set, get, api),
      ...createMetadataSlice(set, get, api),
      ...createFilterSlice(set, get, api),

      exportJSON: () => {
        const { tasks, columns } = get();
        const data = { tasks, columns };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = "taskboard-export.json";
        link.click();
      },

      exportCSV: () => {
        const { tasks, columns, categories, teams, brands } = get();

        const headers = [
          "ID",
          "Content",
          "Column",
          "Category",
          "Team",
          "Brand",
          "Color",
          "Parent Task ID",
          "Promoted Task IDs",
          "Subtasks Count",
          "Subtasks Details",
          "CreatedAt",
        ];

        const rows = tasks.map((task) => {
          const column =
            columns.find((c) => c.id === task.columnId)?.title || task.columnId;
          const category =
            categories.find((c) => c.id === task.categoryId)?.name || "";

          // Resolving team name: from ID paila, then fallback ma string
          const team =
            teams.find((t) => t.id === task.promotedTeam)?.name ||
            task.promotedTeam ||
            "";
          const brand =
            brands.find((b) => b.id === task.brand)?.name || task.brand || "";

          const parentTaskId = task.parentTaskId || "";
          const promotedTaskIds = (task.promotedTaskIds || []).join("; ");

          const subtasksDetails = (task.subtasks || [])
            .map((st) => {
              const stTeam =
                teams.find((t) => t.id === st.team)?.name ||
                st.team ||
                "No Team";
              const status = st.completed ? "Done" : "Pending";
              return `${st.title} (${stTeam}) [${status}]`;
            })
            .join("; ");

          return [
            task.id,
            `"${(task.title || "").replace(/"/g, '""')}"`,
            `"${column}"`,
            `"${category}"`,
            `"${team}"`,
            `"${brand}"`,
            task.color,
            `"${parentTaskId}"`,
            `"${promotedTaskIds}"`,
            task.subtasks?.length || 0,
            `"${subtasksDetails.replace(/"/g, '""')}"`,
            task.createdAt,
          ].join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `taskboard-export-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
      },
    }),
    {
      name: "taskboard-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, newValue) => {
          localStorage.setItem(name, JSON.stringify(newValue, null, 2));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
