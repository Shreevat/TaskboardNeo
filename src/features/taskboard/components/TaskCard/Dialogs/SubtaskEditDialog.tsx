import React from "react";
import { MessageSquare, Trash2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task, Subtask, Category, Brand, Team, Id } from "../../../types";
import { cn } from "@/lib/utils";

interface SubtaskEditDialogProps {
  task: Task;
  subtask: Subtask;
  categories: Category[];
  brands: Brand[];
  teams: Team[];
  canEdit: boolean;
  activeSubtaskEdit: Id | null;
  setActiveSubtaskEdit: (id: Id | null) => void;
  updateSubtask: (taskId: Id, subtaskId: Id, updates: Partial<Subtask>) => void;
  deleteSubtaskComment: (taskId: Id, subtaskId: Id, commentId: Id) => void;
  addSubtaskComment: (taskId: Id, subtaskId: Id, content: string) => void;
  subtaskCommentInput: string;
  setSubtaskCommentInput: (val: string) => void;
}

export function SubtaskEditDialog({
  task,
  subtask,
  categories,
  brands,
  teams,
  canEdit,
  activeSubtaskEdit,
  setActiveSubtaskEdit,
  updateSubtask,
  deleteSubtaskComment,
  addSubtaskComment,
  subtaskCommentInput,
  setSubtaskCommentInput,
}: SubtaskEditDialogProps) {
  return (
    <Dialog
      open={activeSubtaskEdit === subtask.id}
      onOpenChange={(open) => {
        if (canEdit || !open) {
          setActiveSubtaskEdit(open ? subtask.id : null);
        }
      }}
    >
      <DialogTrigger
        disabled={!canEdit}
        className={cn(
          "flex-1 text-md leading-tight transition-all text-left pr-1 min-w-0",
          canEdit ? "cursor-pointer hover:text-primary" : "cursor-default",
        )}
      >
        <div
          className={cn(
            "truncate font-medium flex items-center gap-1",
            subtask.completed &&
              "text-muted-foreground line-through decoration-muted-foreground/30",
          )}
        >
          {subtask.title}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {subtask.categoryId && (
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight bg-muted border border-border px-1 rounded-sm">
              {categories.find((c) => c.id === subtask.categoryId)?.name}
            </span>
          )}
          {subtask.brand && (
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight bg-muted border border-border px-1 rounded-sm">
              {brands.find((b) => b.id === subtask.brand)?.name}
            </span>
          )}
          {subtask.team && (
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight bg-muted border border-border px-1 rounded-sm">
              @{teams.find((t) => t.id === subtask.team)?.name || subtask.team}
            </span>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-sm font-normal uppercase tracking-wider text-primary">
            Edit Subtask
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-6">
          <div className="space-y-2">
            <label className="text-sm font-normal uppercase tracking-widest text-muted-foreground px-1">
              Content
            </label>
            <input
              autoFocus
              className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              value={subtask.title}
              onChange={(e) =>
                updateSubtask(task.id, subtask.id, {
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-normal uppercase tracking-widest text-muted-foreground px-1">
                Team
              </label>
              <select
                className="w-full bg-muted/40 border border-border rounded-lg px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                value={subtask.team || ""}
                onChange={(e) =>
                  updateSubtask(task.id, subtask.id, {
                    team: e.target.value || undefined,
                  })
                }
              >
                <option value="">No Team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-normal uppercase tracking-widest text-muted-foreground px-1">
                Category
              </label>
              <select
                className="w-full bg-muted/40 border border-border rounded-lg px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                value={subtask.categoryId || ""}
                onChange={(e) =>
                  updateSubtask(task.id, subtask.id, {
                    categoryId: e.target.value || undefined,
                  })
                }
              >
                <option value="">Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-normal uppercase tracking-widest text-muted-foreground px-1">
              Brand
            </label>
            <select
              className="w-full bg-muted/40 border border-border rounded-lg px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
              value={subtask.brand || ""}
              onChange={(e) =>
                updateSubtask(task.id, subtask.id, {
                  brand: e.target.value || undefined,
                })
              }
            >
              <option value="">Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-2 border-t border-border">
            <label className="text-sm font-normal uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
              <MessageSquare size={14} /> Comments (
              {subtask.comments?.length || 0})
            </label>
            <div className="space-y-2">
              {(subtask.comments ?? []).map((comment) => (
                <div
                  key={comment.id}
                  className="group/comment bg-muted/30 p-2 rounded border border-border/50 text-sm relative"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        deleteSubtaskComment(task.id, subtask.id, comment.id)
                      }
                      className="opacity-0 group-hover/comment:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 bg-muted/40 border border-border rounded px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Add a comment..."
                value={subtaskCommentInput}
                onChange={(e) => setSubtaskCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (subtaskCommentInput.trim()) {
                      addSubtaskComment(
                        task.id,
                        subtask.id,
                        subtaskCommentInput.trim(),
                      );
                      setSubtaskCommentInput("");
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
