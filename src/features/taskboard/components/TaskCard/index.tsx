"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Subtask, Category, Brand } from "../../types";
import { useTaskCard } from "./hooks/useTaskCard";
import { TASK_COLORS } from "../../store";
import {
  GripVertical,
  Plus,
  Check,
  X,
  CornerDownLeft,
  Palette,
  Clock,
  Lock as LockIcon,
  Users,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dialogs
import { PromotedTasksDialog } from "./Dialogs/PromotedTasksDialog";
import { SubtaskEditDialog } from "./Dialogs/SubtaskEditDialog";
import { SubtaskHistoryDialog } from "./Dialogs/SubtaskHistoryDialog";
import { TaskHistoryDialog } from "./Dialogs/TaskHistoryDialog";
import { TaskDeleteConfirmDialog } from "./Dialogs/TaskDeleteConfirmDialog";
import { CommentsDialog } from "./Dialogs/CommentsDialog";
import { SubtaskDeleteConfirmDialog } from "./Dialogs/SubtaskDeleteConfirmDialog";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const {
    deleteTask,
    updateTaskColor,
    updateTaskTitle,
    updateTaskCategory,
    updateTaskBrand,
    categories,
    brands,
    teams,
    deleteSubtask,
    toggleSubtask,
    promoteSubtask,
    reattachToParent,
    updateSubtask,
    addTaskComment,
    deleteTaskComment,
    addSubtaskComment,
    deleteSubtaskComment,
    columns,
    cardColor,
    isMinimalMode,
    activeSubtaskEdit,
    setActiveSubtaskEdit,
    addingSubtask,
    setAddingSubtask,
    showColorPicker,
    setShowColorPicker,
    isEditingTitle,
    setIsEditingTitle,
    titleInput,
    setTitleInput,
    showHistory,
    setShowHistory,
    showDeleteConfirm,
    setShowDeleteConfirm,
    activeSubtaskHistory,
    setActiveSubtaskHistory,
    subtaskInput,
    setSubtaskInput,
    isCollapsed,
    setIsCollapsed,
    subtaskCommentInput,
    setSubtaskCommentInput,
    showTaskComments,
    setShowTaskComments,
    showPromoted,
    setShowPromoted,
    historySearch,
    setHistorySearch,
    activeSubtaskComments,
    setActiveSubtaskComments,
    inputRef,
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
    handleAddSubtask,
  } = useTaskCard(task);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: isLocked,
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 border-dashed border-primary/50 bg-primary/10 opacity-60 min-h-[82px] rounded-lg shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)] transition-all"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: cardColor }}
      className="group flex flex-col border border-border shadow-sm hover:border-ring hover:shadow-md transition-all duration-150 rounded-lg"
    >
      <div className="flex items-center gap-1 pb-1 pt-1.5 px-2">
        <button
          {...attributes}
          {...listeners}
          className={cn(
            "shrink-0 text-muted-foreground/40 hover:text-foreground touch-none p-1 transition-opacity duration-200",
            isLocked
              ? "cursor-not-allowed opacity-20"
              : "cursor-grab active:cursor-grabbing",
          )}
          aria-label={
            isLocked
              ? "Movement locked - task has active split-offs"
              : "Drag handle"
          }
        >
          {isLocked ? <LockIcon size={14} /> : <GripVertical size={16} />}
        </button>

        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between gap-2 pr-1">
            <div className="min-w-0 flex-1">
              {isEditingTitle ? (
                <input
                  autoFocus
                  className="text-md-plus font-bold text-foreground bg-transparent border-b-2 border-primary/30 outline-none w-full py-0 px-1.5"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={() => {
                    updateTaskTitle(task.id, titleInput);
                    setIsEditingTitle(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateTaskTitle(task.id, titleInput);
                      setIsEditingTitle(false);
                    }
                    if (e.key === "Escape") {
                      setTitleInput(task.title || "");
                      setIsEditingTitle(false);
                    }
                  }}
                />
              ) : (
                <div
                  className={cn(
                    "text-lg font-bold text-foreground cursor-text hover:text-primary transition-colors truncate px-1.5",
                    !canEdit && "cursor-default hover:text-foreground",
                  )}
                  onClick={() => canEdit && setIsEditingTitle(true)}
                  title={task.title || "Untitled Task"}
                >
                  {task.title || "Untitled Task"}
                </div>
              )}
            </div>
            <PromotedTasksDialog
              task={task}
              promotedTasks={promotedTasks}
              columns={columns}
              showPromoted={showPromoted}
              setShowPromoted={setShowPromoted}
            />
            {isCollapsed && (task.comments?.length ?? 0) > 0 && (
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-normal uppercase tracking-wider text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/30 select-none">
                <MessageSquare size={10} />
                {task.comments.length}
              </span>
            )}
            {isCollapsed && subtasks.some((s) => (s.comments?.length ?? 0) > 0) && (
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-normal uppercase tracking-wider text-muted-foreground/60 bg-muted/30 px-1.5 py-0.5 rounded border border-border/20 select-none" title={`${subtasks.reduce((acc, s) => acc + (s.comments?.length ?? 0), 0)} subtask comment(s)`}>
                <MessageSquare size={9} className="opacity-60" />
                {subtasks.reduce((acc, s) => acc + (s.comments?.length ?? 0), 0)}
              </span>
            )}


          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {/* Category Selection */}
            <select
              className="text-[10px] font-bold bg-muted/50 text-muted-foreground/80 border-none rounded px-1.5 py-0.5 outline-none cursor-pointer hover:bg-muted transition-colors max-w-[80px] truncate disabled:opacity-70 disabled:cursor-default"
              value={task.categoryId || ""}
              disabled={!canEdit}
              onChange={(e) =>
                updateTaskCategory(task.id, e.target.value || undefined)
              }
            >
              <option value="">Category</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Brand Dropdown */}
            <select
              className="text-[10px] font-bold bg-muted/50 text-muted-foreground/80 border-none rounded px-1.5 py-0.5 outline-none cursor-pointer hover:bg-muted transition-colors max-w-[80px] truncate disabled:opacity-70 disabled:cursor-default"
              value={task.brand || ""}
              disabled={!canEdit}
              onChange={(e) =>
                updateTaskBrand(task.id, e.target.value || undefined)
              }
            >
              <option value="">Brand</option>
              {brands.map((brand: Brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          className={cn(
            "shrink-0 text-muted-foreground/40 hover:text-primary p-1 rounded-md hover:bg-primary/5 transition-all",
          )}
          aria-label={isCollapsed ? "Expand task" : "Collapse task"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-2 pb-1.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {parentTask && (
            <button
              onClick={() => reattachToParent(task.id)}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-primary/70 bg-primary/5 border border-primary/10 rounded px-1.5 py-0.5 w-fit max-w-full hover:bg-primary/10 transition-colors cursor-pointer mb-2"
            >
              <CornerDownLeft size={8} />
              <span className="truncate">
                subtask of: {parentTask?.title || `#${parentTask?.id}`}
              </span>
            </button>
          )}

          <div className="flex flex-wrap gap-1.5 py-1 items-center">
            {/* Deadline */}
            {task.deadline && (
              <span className="text-md font-medium bg-primary/10 text-primary border-none rounded px-2 py-0.5 flex items-center gap-1">
                <Clock size={10} />{" "}
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
            {/* Taara */}
            {task.difficulty && (
              <div
                className="flex items-center gap-0.5 bg-muted px-2 py-0.5 rounded text-amber-600 border border-border/50"
                title={`Difficulty: ${task.difficulty}/3`}
              >
                {[...Array(Math.min(3, Math.max(0, task.difficulty || 0)))].map(
                  (_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className="fill-amber-500/80 text-amber-500/80"
                    />
                  ),
                )}
              </div>
            )}
            {/* Promoted Task ko Team Badge*/}
            {task.promotedTeam && (
              <span className="text-md font-normal bg-muted/70 text-muted-foreground border-none rounded px-2 py-0.5 max-w-[80px] truncate flex items-center gap-1">
                <Users size={10} /> {promotedTeamName || task.promotedTeam}
              </span>
            )}
          </div>
          {/*Subtasks eta*/}
          {(totalSubtasks > 0 || addingSubtask) && (
            <div
              className="flex flex-col gap-1 mb-2"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {subtasks.map((subtask: Subtask) => (
                <div key={subtask.id} className="group/sub">
                  <div
                    className="flex items-center gap-2 py-1 px-1.5 relative border border-border bg-muted/20 hover:bg-muted/40 transition-all rounded-sm"
                    style={{
                      borderLeftColor: cardColor,
                      borderLeftWidth: "3px",
                    }}
                  >
                    <button
                      onClick={() => toggleSubtask(task.id, subtask.id)}
                      className={`h-3.5 w-3.5 rounded-sm border flex items-center justify-center transition-colors ${subtask.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 hover:border-primary bg-background"}`}
                      aria-label="Toggle subtask completion"
                    >
                      {subtask.completed && <Check size={8} strokeWidth={3} />}
                    </button>

                    <SubtaskEditDialog
                      task={task}
                      subtask={subtask}
                      categories={categories}
                      brands={brands}
                      teams={teams}
                      canEdit={canEdit}
                      activeSubtaskEdit={activeSubtaskEdit}
                      setActiveSubtaskEdit={setActiveSubtaskEdit}
                      updateSubtask={updateSubtask}
                      deleteSubtaskComment={deleteSubtaskComment}
                      addSubtaskComment={addSubtaskComment}
                      subtaskCommentInput={subtaskCommentInput}
                      setSubtaskCommentInput={setSubtaskCommentInput}
                    />

                    <div className="flex items-center gap-1.5 opacity-0 group-hover/sub:opacity-100 transition-opacity pr-2">
                      <SubtaskHistoryDialog
                        subtask={subtask}
                        activeSubtaskHistory={activeSubtaskHistory}
                        setActiveSubtaskHistory={setActiveSubtaskHistory}
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSubtaskComments(subtask.id);
                        }}
                        className={cn(
                          "p-1.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-primary transition-colors flex items-center gap-1",
                          activeSubtaskComments === subtask.id &&
                            "text-primary bg-primary/10",
                        )}
                        title="View subtask comments"
                      >
                        <MessageSquare size={13} />
                        {subtask.comments?.length > 0 && (
                          <span className="text-[10px] font-bold">
                            {subtask.comments.length}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => promoteSubtask(task.id, subtask.id)}
                        className="p-1 text-muted-foreground hover:text-primary transition-colors rounded-sm hover:bg-muted/50"
                        title="Split off into standalone task"
                      >
                        <CornerDownLeft size={12} className="rotate-180" />
                      </button>
                      {/* Subtask Deletion COnFirmation */}
                      <SubtaskDeleteConfirmDialog
                        taskId={task.id}
                        subtaskId={subtask.id}
                        deleteSubtask={deleteSubtask}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Subtask Add + Continuos */}
              {addingSubtask && (
                <div className="flex items-center gap-1 border border-border bg-card px-1.5 py-0.5">
                  <input
                    ref={inputRef}
                    autoFocus
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    placeholder="Subtask title…"
                    className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubtask();
                      if (e.key === "Escape") {
                        setAddingSubtask(false);
                        setSubtaskInput("");
                      }
                    }}
                  />
                  <button
                    onClick={handleAddSubtask}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Confirm subtask"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={() => {
                      setAddingSubtask(false);
                      setSubtaskInput("");
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Cancel"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Color Select Here */}
          {showColorPicker && (
            <div
              className="flex flex-wrap gap-1.5 px-2 pb-1.5"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {TASK_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    updateTaskColor(task.id, c);
                    setShowColorPicker(false);
                  }}
                  className={`w-4 h-4 rounded-full border border-black/10 transition-transform hover:scale-125 ${
                    task.color === c ? "ring-2 ring-ring ring-offset-1" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground pb-1 border-b border-border/40 mb-2">
            <div className="flex items-center gap-1">
              {formattedDate}{" "}
              {formattedUpdate && `· updated ${formattedUpdate}`}
            </div>
            {totalSubtasks > 0 && (
              <span className="font-bold text-muted-foreground bg-muted border border-border/50 px-1.5 rounded-sm">
                {completedCount}/{totalSubtasks} subtasks
              </span>
            )}
            {/* Initiator. */}
            {task.initiatedBy && (
              <span
                className="font-medium text-primary/80 bg-primary/5 px-1.5 rounded-sm"
                title={`Initiated By`}
              >
                {task.initiatedBy}
              </span>
            )}
          </div>
          <div
            className="px-2 pb-1.5 flex items-center justify-between"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {canEdit && (
              <button
                onClick={() => {
                  setAddingSubtask(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus size={10} />
                Add subtask
              </button>
            )}

            <div className="flex items-center gap-1 ml-auto transition-all duration-150">
              {!task.parentTaskId && !isMinimalMode && (
                <button
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowHistory(false);
                  }}
                  className="text-muted-foreground hover:text-foreground p-1.5 rounded-sm hover:bg-muted transition-colors"
                  aria-label="Change color"
                >
                  <Palette size={15} />
                </button>
              )}
              <button
                onClick={() => {
                  setShowTaskComments(!showTaskComments);
                }}
                className={cn(
                  "p-1.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-primary transition-colors flex items-center gap-1",
                  showTaskComments && "text-primary bg-primary/10",
                )}
                title="View task comments"
              >
                <MessageSquare size={15} />
                {task.comments?.length > 0 && (
                  <span className="text-[10px] font-bold">
                    {task.comments.length}
                  </span>
                )}
              </button>
              <TaskHistoryDialog
                task={task}
                showHistory={showHistory}
                setShowHistory={setShowHistory}
                historySearch={historySearch}
                setHistorySearch={setHistorySearch}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
              />
              <TaskDeleteConfirmDialog
                taskId={task.id}
                showDeleteConfirm={showDeleteConfirm}
                setShowDeleteConfirm={setShowDeleteConfirm}
                deleteTask={deleteTask}
              />
            </div>
          </div>

          <CommentsDialog
            isOpen={showTaskComments}
            onOpenChange={setShowTaskComments}
            title={`${task.title} Comments`}
            subtitle={task.title || "Untitled Task"}
            comments={task.comments ?? []}
            onAdd={(content) => addTaskComment(task.id, content)}
            onDelete={(commentId) => deleteTaskComment(task.id, commentId)}
          />

          {subtasks.map((subtask) => (
            <CommentsDialog
              key={subtask.id}
              isOpen={activeSubtaskComments === subtask.id}
              onOpenChange={(open) =>
                setActiveSubtaskComments(open ? subtask.id : null)
              }
              title={`${subtask.title} Comments`}
              subtitle={subtask.title}
              comments={subtask.comments ?? []}
              onAdd={(content) =>
                addSubtaskComment(task.id, subtask.id, content)
              }
              onDelete={(commentId) =>
                deleteSubtaskComment(task.id, subtask.id, commentId)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
