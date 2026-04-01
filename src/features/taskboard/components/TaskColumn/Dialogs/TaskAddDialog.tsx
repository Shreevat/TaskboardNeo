"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTaskBoardStore } from "@/features/taskboard/store";

interface TaskAddDialogProps {
  columnId: string | number;
}

export default function TaskAddDialog({ columnId }: TaskAddDialogProps) {
  const [open, setOpen] = useState(false);
  const categories = useTaskBoardStore((s) => s.categories);
  const brands = useTaskBoardStore((s) => s.brands);
  const addMultipleTasks = useTaskBoardStore((s) => s.addMultipleTasks);

  const [tasks, setTasks] = useState([
    {
      title: "",
      categoryId: "",
      brand: "",
      difficulty: 2,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      initiatedBy: "",
      subtasks: [] as string[],
    },
  ]);

  const handleAddTaskField = () => {
    setTasks([
      ...tasks,
      {
        title: "",
        categoryId: "",
        brand: "",
        difficulty: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        initiatedBy: "",
        subtasks: [] as string[],
      },
    ]);
  };

  const handleAddSubtask = (index: number) => {
    const updated = [...tasks];
    updated[index].subtasks = [...updated[index].subtasks, ""];
    setTasks(updated);
  };

  const handleRemoveSubtask = (taskIndex: number, subtaskIndex: number) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks = updated[taskIndex].subtasks.filter(
      (_, i) => i !== subtaskIndex,
    );
    setTasks(updated);
  };

  const handleSubtaskChange = (
    taskIndex: number,
    subtaskIndex: number,
    value: string,
  ) => {
    const updated = [...tasks];
    updated[taskIndex].subtasks[subtaskIndex] = value;
    setTasks(updated);
  };

  const handleRemoveTaskField = (index: number) => {
    if (tasks.length === 1) return;
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [field]: value };
    setTasks(updated);
  };

  const handleCreate = () => {
    const validTasks = tasks.filter((t) => t.title.trim());
    if (validTasks.length === 0) return;

    addMultipleTasks(
      columnId,
      validTasks.map((t) => ({
        ...t,
        categoryId: t.categoryId || undefined,
        brand: t.brand || undefined,
        difficulty: Number(t.difficulty),
        subtasks: t.subtasks.filter((st) => st.trim()),
      })),
    );

    setTasks([
      {
        title: "",
        categoryId: "",
        brand: "",
        difficulty: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        initiatedBy: "",
        subtasks: [],
      },
    ]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="flex w-full items-center gap-1.5 px-2 py-1.5 text-md-plus text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <Plus size={14} />
            Add a Task
          </button>
        }
      />
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Tasks</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 py-4 flex flex-col gap-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-3 border border-border rounded-lg bg-muted/20 relative group"
            >
              {tasks.length > 1 && (
                <button
                  onClick={() => handleRemoveTaskField(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 order-1 md:order-none">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Task Name
                  </label>
                  <Input
                    autoFocus={index === tasks.length - 1}
                    placeholder="Enter task description..."
                    value={task.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                    className="h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 order-2 md:order-none">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Difficulty (1-3)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="3"
                      value={task.difficulty}
                      onChange={(e) =>
                        handleChange(index, "difficulty", e.target.value)
                      }
                      className="h-9"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Deadline
                    </label>
                    <Input
                      type="date"
                      value={task.deadline}
                      onChange={(e) =>
                        handleChange(index, "deadline", e.target.value)
                      }
                      className="h-9 p-2"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 order-2.5 md:order-none">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Initiated By
                  </label>
                  <Input
                    placeholder="Name of person..."
                    value={task.initiatedBy}
                    onChange={(e) =>
                      handleChange(index, "initiatedBy", e.target.value)
                    }
                    className="h-9"
                  />
                </div>

                <div className="flex flex-col gap-1.5 order-3 md:order-none">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Category
                  </label>
                  <select
                    className="h-9 bg-background border border-input rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                    value={task.categoryId}
                    onChange={(e) =>
                      handleChange(index, "categoryId", e.target.value)
                    }
                  >
                    <option value="">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 order-4 md:order-none">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Brand
                  </label>
                  <select
                    className="h-9 bg-background border border-input rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                    value={task.brand}
                    onChange={(e) =>
                      handleChange(index, "brand", e.target.value)
                    }
                  >
                    <option value="">No Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  Subtasks (Fallback to defaults if empty)
                  <button
                    onClick={() => handleAddSubtask(index)}
                    className="text-primary hover:underline flex items-center gap-1 normal-case font-medium"
                  >
                    <Plus size={12} /> Add Subtask
                  </button>
                </label>
                <div className="flex flex-wrap gap-2">
                  {task.subtasks.map((st, si) => (
                    <div key={si} className="flex items-center gap-1 group/sub">
                      <Input
                        value={st}
                        placeholder={`Subtask ${si + 1}`}
                        onChange={(e) =>
                          handleSubtaskChange(index, si, e.target.value)
                        }
                        className="h-7 text-xs w-32"
                      />
                      <button
                        onClick={() => handleRemoveSubtask(index, si)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {task.subtasks.length === 0 && (
                    <span className="text-[10px] italic text-muted-foreground">
                      No custom subtasks added.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full border-dashed border-2 py-6 flex items-center gap-2 hover:bg-muted/50"
            onClick={handleAddTaskField}
          >
            <Plus size={16} />
            Add More
          </Button>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Tasks ({tasks.filter((t) => t.title.trim()).length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
