import TaskBoard from "@/features/taskboard";

export default function BoardPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <TaskBoard />
      </main>
    </div>
  );
}
