import { MessageSquare, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Comment, Id } from "@/features/taskboard/types";
import { useState } from "react";

interface CommentsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  comments: Comment[];
  onAdd: (content: string) => void;
  onDelete: (commentId: Id) => void;
}

export function CommentsDialog({
  isOpen,
  onOpenChange,
  title,
  subtitle,
  comments,
  onAdd,
  onDelete,
}: CommentsDialogProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border shadow-2xl flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-muted/10">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-primary" size={18} />
            <div className="flex flex-col">
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                {title}
              </DialogTitle>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[40vh] p-4">
          <div className="flex flex-col gap-3">
            {!comments || comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50 gap-2">
                <MessageSquare size={32} strokeWidth={1} />
                <p className="text-xs italic">No comments yet. Start the conversation!</p>
              </div>
            ) : (
              [...comments].reverse().map((comment) => (
                <div
                  key={comment.id}
                  className="group/comment bg-muted/30 p-3 rounded-lg border border-border/50 text-sm relative transition-colors hover:bg-muted/50"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/50 font-mono">
                      {new Date(comment.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="opacity-0 group-hover/comment:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1"
                      title="Delete comment"
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

        <div className="p-4 border-t bg-muted/5 flex gap-2">
          <input
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 shadow-inner transition-all"
            placeholder="Write a comment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button
            size="sm"
            className="h-9 px-4 text-xs font-bold"
            onClick={handleAdd}
            disabled={!input.trim()}
          >
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
