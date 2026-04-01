import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskBoardStore } from "@/features/taskboard/store";

export function CategoriesTab() {
  const [newName, setNewName] = useState("");

  const categories = useTaskBoardStore((s) => s.categories) || [];
  const addCategory = useTaskBoardStore((s) => s.addCategory);
  const deleteCategory = useTaskBoardStore((s) => s.deleteCategory);
  const updateCategory = useTaskBoardStore((s) => s.updateCategory);

  const handleCreate = () => {
    if (!newName.trim()) return;
    addCategory(newName.trim());
    setNewName("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Add New Category
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Category Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button onClick={handleCreate} className="gap-2">
            <Plus size={16} /> Add
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Existing Categories
        </h3>
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
          {categories.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No categories yet.
            </p>
          )}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 p-2 rounded-md bg-muted/30 border border-border/50"
            >
              <Input
                className="h-8 text-xs bg-transparent border-none focus-visible:ring-0"
                value={cat.name}
                onChange={(e) => updateCategory(cat.id, e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => deleteCategory(cat.id)}
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
