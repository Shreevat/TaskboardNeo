import { useTaskActions } from "./useTaskActions";
import { useTaskCardState } from "./useTaskCardState";
import { Task } from "@/features/taskboard/types";

export function useTaskCard(task: Task) {
  const actions = useTaskActions();
  const state = useTaskCardState(task);

  const parentTask = actions.allTasks.find((t) => t.id === task.parentTaskId);
  const selectedCategory = actions.categories.find(
    (c) => c.id === task.categoryId,
  );
  const selectedBrand = actions.brands.find((b) => b.id === task.brand);
  const promotedTeamName = actions.teams.find(
    (t) => t.id === task.promotedTeam,
  )?.name;

  const subtasks = task.subtasks ?? [];
  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalSubtasks = subtasks.length;

  const promotedTasks = actions.allTasks.filter((t) =>
    task.promotedTaskIds?.includes(t.id),
  );

  const isLocked = (task.promotedTaskIds?.length ?? 0) > 0;
  const canEdit = task.columnId === "prime";
  const cardColor = actions.isMinimalMode ? "#f1f5f9" : (task.color as string);

  const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedUpdate =
    task.updatedAt && task.updatedAt !== task.createdAt
      ? new Date(task.updatedAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const handleAddSubtask = () => {
    const trimmed = state.subtaskInput.trim();
    if (!trimmed) return;
    actions.addSubtask(task.id, trimmed);
    state.setSubtaskInput("");
    state.inputRef.current?.focus();
  };

  return {
    ...actions,
    ...state,
    parentTask,
    selectedCategory,
    selectedBrand,
    promotedTeamName,
    subtasks,
    completedCount,
    totalSubtasks,
    promotedTasks,
    isLocked,
    canEdit,
    formattedDate,
    formattedUpdate,
    cardColor,
    handleAddSubtask,
  };
}
