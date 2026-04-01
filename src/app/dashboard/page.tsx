export default function DashboardPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-muted/20">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-layout-dashboard"
          >
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Dashboard</h1>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest opacity-60">Page in Development</p>
        </div>
      </div>
    </div>
  );
}
