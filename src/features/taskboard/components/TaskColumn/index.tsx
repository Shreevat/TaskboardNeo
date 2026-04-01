"use client";

import { useMemo } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { Column, Task } from "@/features/taskboard/types";
import TaskCard from "@/features/taskboard/components/TaskCard";
import TaskAddDialog from "@/features/taskboard/components/TaskColumn/Dialogs/TaskAddDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
}

export default function TaskColumn({ column, tasks }: TaskColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: column.id });

  const {
    setNodeRef: setSortRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div
        ref={setSortRef}
        style={style}
        className="flex-1 basis-0 min-w-[180px] border border-dashed border-border bg-muted/30 h-full opacity-40 rounded-lg"
      />
    );
  }

  return (
    <div
      ref={setSortRef}
      style={style}
      className={cn(
        "flex flex-1 basis-0 min-w-[180px] flex-col border border-border bg-card shadow-sm h-full rounded-lg transition-all",
        isOver &&
        "border-primary/50 bg-primary/10 shadow-lg ring-2 ring-primary/30 ring-offset-0",
      )}
    >
      {/* Header */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between gap-1 px-2 py-2 border-b border-border select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate font-black text-foreground text-lg uppercase tracking-wider">
            {column.title}
          </span>
          <Badge
            variant="secondary"
            className="shrink-0 text-[10px] px-1.5 py-0 h-4 border-none text-amber-900/60"
            style={{ backgroundColor: "#FFF9E5" }}
          >
            {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={setDropRef}
        className="flex flex-1 flex-col gap-1 px-1 py-1 min-h-[60px] overflow-y-auto"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      {/* Add Task - prime column only */}
      {column.id === "prime" && (
        <div className="px-1 pb-1 border-t border-border pt-1">
          <TaskAddDialog columnId={column.id} />
        </div>
      )}
    </div>
  );
}
