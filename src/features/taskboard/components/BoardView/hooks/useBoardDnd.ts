import { useState, useRef, useMemo } from "react";
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { Column, Task } from "@/features/taskboard/types";
import { useTaskBoardStore } from "@/features/taskboard/store";

export function useBoardDnd() {
  const tasks = useTaskBoardStore((s) => s.tasks);
  const columns = useTaskBoardStore((s) => s.columns);
  const reorderColumns = useTaskBoardStore((s) => s.reorderColumns);
  const moveTask = useTaskBoardStore((s) => s.moveTask);
  const setTasks = useTaskBoardStore((s) => s.setTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [originalTasks, setOriginalTasks] = useState<Task[]>([]);

  const [moveConfirmTask, setMoveConfirmTask] = useState<Task | null>(null);
  const [moveConfirmTargetCol, setMoveConfirmTargetCol] =
    useState<Column | null>(null);
  const moveConfirmedRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onDragStart = (event: DragStartEvent) => {
    setOriginalTasks([...tasks]);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const isActiveTask = active.data.current?.type === "Task";
    if (!isActiveTask) return;

    if (over.data.current?.type === "Task")
      moveTask(active.id, over.id, "Task");
    if (over.data.current?.type === "Column")
      moveTask(active.id, over.id, "Column");
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.data.current?.type === "Task" && over) {
      const activeTaskData = active.data.current.task as Task;
      const initialTask = originalTasks.find((t) => t.id === activeTaskData.id);

      if (initialTask) {
        const hasMoved =
          tasks.find((t) => t.id === activeTaskData.id)?.columnId !==
            initialTask.columnId ||
          tasks.find((t) => t.id === activeTaskData.id)?.position !==
            initialTask.position;

        if (hasMoved) {
          const finalTaskState = tasks.find((t) => t.id === activeTaskData.id);
          const targetCol = columns.find(
            (c) => c.id === finalTaskState?.columnId,
          );

          setMoveConfirmTask(activeTaskData);
          setMoveConfirmTargetCol(targetCol || null);
        }
      }
    }

    setActiveColumn(null);
    setActiveTask(null);

    if (!over || active.id === over.id) return;
    if (active.data.current?.type === "Column") {
      reorderColumns(active.id, over.id);
    }
  };

  const handleConfirmMove = () => {
    moveConfirmedRef.current = true;
    setMoveConfirmTask(null);
  };

  const handleCancelMove = () => {
    setTasks(originalTasks);
    setMoveConfirmTask(null);
  };

  const onOpenChangeConfirm = (open: boolean) => {
    if (!open) {
      if (!moveConfirmedRef.current) {
        setTasks(originalTasks);
      }
      setMoveConfirmTask(null);
      moveConfirmedRef.current = false;
    }
  };

  return {
    activeColumn,
    activeTask,
    sensors,
    onDragStart,
    onDragOver,
    onDragEnd,
    moveConfirmTask,
    moveConfirmTargetCol,
    handleConfirmMove,
    handleCancelMove,
    onOpenChangeConfirm,
  };
}
