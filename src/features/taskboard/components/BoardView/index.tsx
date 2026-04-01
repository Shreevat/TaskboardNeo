"use client";

import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useMemo } from "react";
import { useTaskBoardStore, filterTask } from "@/features/taskboard/store";
import TaskColumn from "@/features/taskboard/components/TaskColumn";
import TaskCard from "@/features/taskboard/components/TaskCard";
import TaskFilters from "@/features/taskboard/components/TaskFilters";
import { BoardHeader } from "./components/BoardHeader";
import { MoveConfirmDialog } from "./Dialogs/MoveConfirmDialog";
import { useBoardDnd } from "./hooks/useBoardDnd";

export default function BoardView() {
  const columns = useTaskBoardStore((s) => s.columns);
  const tasks = useTaskBoardStore((s) => s.tasks);


  // Selectors for board-wide filtering preferences (search, teams, categories, brands)
  const searchQuery = useTaskBoardStore((s) => s.searchQuery);
  const selectedTeams = useTaskBoardStore((s) => s.selectedTeams);
  const selectedCategories = useTaskBoardStore((s) => s.selectedCategories);
  const selectedBrands = useTaskBoardStore((s) => s.selectedBrands);

  const {
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
  } = useBoardDnd();

  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => a.position - b.position),
    [columns],
  );
  const columnIds = useMemo(
    () => sortedColumns.map((c) => c.id),
    [sortedColumns],
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      filterTask(
        task,
        searchQuery,
        selectedTeams,
        selectedCategories,
        selectedBrands,
      ),
    );
  }, [tasks, searchQuery, selectedTeams, selectedCategories, selectedBrands]);

  return (
    <div className="flex flex-col h-full">
      <BoardHeader />
      <TaskFilters />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex-1 flex items-stretch gap-px px-2 py-2 overflow-x-auto min-h-0 bg-muted/20">
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {sortedColumns.map((col) => (
              <TaskColumn
                key={col.id}
                column={col}
                tasks={filteredTasks
                  .filter((t) => t.columnId === col.id)
                  .sort((a, b) => a.position - b.position)}
              />
            ))}
          </SortableContext>
        </div>

        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <div className="w-60 text-foreground">
                  <TaskColumn
                    column={activeColumn}
                    tasks={filteredTasks
                      .filter((t) => t.columnId === activeColumn.id)
                      .sort((a, b) => a.position - b.position)}
                  />
                </div>
              )}
              {activeTask && (
                <div className="w-56 text-foreground">
                  <TaskCard task={activeTask} />
                </div>
              )}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>

      <MoveConfirmDialog
        task={moveConfirmTask}
        targetColumn={moveConfirmTargetCol}
        onConfirm={handleConfirmMove}
        onCancel={handleCancelMove}
        onOpenChange={onOpenChangeConfirm}
      />
    </div>
  );
}
