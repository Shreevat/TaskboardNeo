import { MessageSquare, X, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Task, Id } from "@/features/taskboard/types";

interface TaskCommentsDrawerProps {
  task: Task;
  showTaskComments: boolean;
  setShowTaskComments: (show: boolean) => void;
  taskCommentInput: string;
  setTaskCommentInput: (val: string) => void;
  addTaskComment: (taskId: Id, content: string) => void;
  deleteTaskComment: (taskId: Id, commentId: Id) => void;
}

export function TaskCommentsDrawer({
  task,
  showTaskComments,
  setShowTaskComments,
  taskCommentInput,
  setTaskCommentInput,
  addTaskComment,
  deleteTaskComment,
}: TaskCommentsDrawerProps) {
  if (!showTaskComments) return null;

  return (
    <div
      className="px-3 pb-3 border-t border-border/40 pt-3 bg-muted/5 flex flex-col gap-3"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-normal uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <MessageSquare size={12} /> Task Comments
        </h4>
        <button
          onClick={() => setShowTaskComments(false)}
          className="text-muted-foreground hover:text-foreground p-0.5"
        >
          <X size={12} />
        </button>
      </div>

      <ScrollArea className="max-h-[200px] pr-3">
        <div className="flex flex-col gap-2">
          {!task.comments || task.comments.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic py-2">
              No comments yet.
            </p>
          ) : (
            [...task.comments].reverse().map((comment) => (
              <div
                key={comment.id}
                className="group/tcomment bg-background/50 p-2.5 rounded-lg border border-border/30 text-sm relative shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                    {new Date(comment.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={() => deleteTaskComment(task.id, comment.id)}
                    className="opacity-0 group-hover/tcomment:opacity-100 text-muted-foreground hover:text-destructive transition-all duration-150 p-0.5"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
          placeholder="Type a comment..."
          value={taskCommentInput}
          onChange={(e) => setTaskCommentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (taskCommentInput.trim()) {
                addTaskComment(task.id, taskCommentInput.trim());
                setTaskCommentInput("");
              }
            }
          }}
        />
        <Button
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() => {
            if (taskCommentInput.trim()) {
              addTaskComment(task.id, taskCommentInput.trim());
              setTaskCommentInput("");
            }
          }}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
