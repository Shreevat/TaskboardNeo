import { cn } from "@/lib/utils";
import { useTaskBoardStore } from "@/features/taskboard/store";

export function AppearanceTab() {
  const isMinimalMode = useTaskBoardStore((s) => s.isMinimalMode);
  const toggleMinimalMode = useTaskBoardStore((s) => s.toggleMinimalMode);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Appearance Settings
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">Minimal Mode</h4>
            <p className="text-xs text-muted-foreground">
              Force all task cards to a single uniform color for a cleaner look.
            </p>
          </div>
          <button
            onClick={toggleMinimalMode}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative shadow-inner",
              isMinimalMode ? "bg-primary" : "bg-muted-foreground/30",
            )}
          >
            <div
              className={cn(
                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                isMinimalMode && "translate-x-6",
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
