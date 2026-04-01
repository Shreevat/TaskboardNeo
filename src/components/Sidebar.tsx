"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Task Board", href: "/board", icon: Kanban },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-card text-card-foreground transition-all duration-300 ease-in-out h-full border-r border-border relative z-50 shadow-sm",
        collapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      <div
        className={cn(
          "flex items-center p-6 mb-2",
          collapsed ? "justify-center px-0" : "gap-3",
        )}
      >
        {!collapsed && (
          <span className="text-3xl font-bold tracking-tighter text-text">
            Panel
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon
                size={20}
                className={cn(
                  "shrink-0 transition-transform group-hover:scale-110",
                  isActive && "text-primary-foreground",
                )}
              />
              {!collapsed && (
                <span className="text-sm font-semibold tracking-wide">
                  {item.name}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary-foreground rounded-l-full shadow-lg" />
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-card border border-border rounded-full p-1 text-muted-foreground hover:text-foreground shadow-md transition-all z-50 hover:scale-110"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
