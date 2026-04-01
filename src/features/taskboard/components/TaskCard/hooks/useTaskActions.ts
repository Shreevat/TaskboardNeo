import { useTaskBoardStore } from "@/features/taskboard/store";

export function useTaskActions() {
  const categories = Array.isArray(useTaskBoardStore((s) => s.categories)) ? useTaskBoardStore((s) => s.categories) : [];
  const brands = Array.isArray(useTaskBoardStore((s) => s.brands)) ? useTaskBoardStore((s) => s.brands) : [];
  const teams = Array.isArray(useTaskBoardStore((s) => s.teams)) ? useTaskBoardStore((s) => s.teams) : [];

  const updateTaskColor = useTaskBoardStore((s) => s.updateTaskColor);
  const updateTaskTitle = useTaskBoardStore((s) => s.updateTaskTitle);
  const updateTaskCategory = useTaskBoardStore((s) => s.updateTaskCategory);
  const updateTaskBrand = useTaskBoardStore((s) => s.updateTaskBrand);
  const deleteTask = useTaskBoardStore((s) => s.deleteTask);

  const addSubtask = useTaskBoardStore((s) => s.addSubtask);
  const deleteSubtask = useTaskBoardStore((s) => s.deleteSubtask);
  const toggleSubtask = useTaskBoardStore((s) => s.toggleSubtask);
  const promoteSubtask = useTaskBoardStore((s) => s.promoteSubtask);
  const reattachToParent = useTaskBoardStore((s) => s.reattachToParent);
  const updateSubtask = useTaskBoardStore((s) => s.updateSubtask);

  const addTaskComment = useTaskBoardStore((s) => s.addTaskComment);
  const deleteTaskComment = useTaskBoardStore((s) => s.deleteTaskComment);
  const addSubtaskComment = useTaskBoardStore((s) => s.addSubtaskComment);
  const deleteSubtaskComment = useTaskBoardStore((s) => s.deleteSubtaskComment);

  const allTasks = useTaskBoardStore((s) => s.tasks);
  const columns = useTaskBoardStore((s) => s.columns);
  const isMinimalMode = useTaskBoardStore((s) => s.isMinimalMode);

  return {
    categories,
    brands,
    teams,
    updateTaskColor,
    updateTaskTitle,
    updateTaskCategory,
    updateTaskBrand,
    deleteTask,
    addSubtask,
    deleteSubtask,
    toggleSubtask,
    promoteSubtask,
    reattachToParent,
    updateSubtask,
    addTaskComment,
    deleteTaskComment,
    addSubtaskComment,
    deleteSubtaskComment,
    allTasks,
    columns,
    isMinimalMode,
  };
}
