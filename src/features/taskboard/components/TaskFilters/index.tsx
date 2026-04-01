import { useMemo, useState, useRef, useEffect } from "react";
import { useTaskBoardStore } from "@/features/taskboard/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Filter,
  Tag as TagIcon,
  Users,
  Briefcase,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { filterTask } from "@/features/taskboard/store";

interface FilterDropdownProps {
  label: string;
  icon: any;
  options: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  activeColorClass: string;
  onReset: () => void;
  counts?: Record<string, { total: number; filtered: number }>;
}

function FilterDropdown({
  label,
  icon: Icon,
  options,
  selected,
  onToggle,
  onReset,
  activeColorClass,
  counts,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  );

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className={cn(
          "h-9 gap-2 px-3 rounded-lg border-none shadow-none transition-all duration-200 group",
          selected.length > 0
            ? activeColorClass
            : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <Icon
          size={14}
          className={cn(
            "transition-colors",
            selected.length > 0
              ? activeColorClass.includes("text-white")
                ? "text-white"
                : "text-primary"
              : "text-primary/60 group-hover:text-primary",
          )}
        />
        <span className="text-sm lg:text-md font-bold uppercase tracking-wider">
          {label}
        </span>
        {selected.length > 0 && (
          <Badge
            variant="secondary"
            className={cn(
              "h-5 px-1.5 min-w-[20px] justify-center border-none text-[10px] font-bold",
              selected.length > 0 && !activeColorClass.includes("text-white")
                ? "bg-primary text-white"
                : "bg-white/20 text-white",
            )}
          >
            {selected.length}
          </Badge>
        )}
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-300 ease-out opacity-60 group-hover:opacity-100",
            open && "rotate-180",
          )}
        />
      </Button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-card border border-border rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-left ring-1 ring-black/5">
          <div className="relative mb-2 px-1 pt-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={12}
            />
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-md bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 rounded-lg"
              autoFocus
            />
          </div>
          <ScrollArea
            className={cn(
              "px-1",
              options.length > 6 ? "h-60" : "h-auto max-h-60",
            )}
          >
            <div className="flex flex-col gap-0.5 pb-1">
              {filteredOptions.map((opt) => {
                const isSelected = selected.includes(opt.id);
                const count = counts?.[opt.id];
                return (
                  <button
                    key={opt.id}
                    onClick={() => onToggle(opt.id)}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-md transition-all text-left group/item",
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <div className="flex flex-col min-w-0 flex-1 pr-2">
                      <span className="truncate">{opt.name}</span>
                      {count && (
                        <span className="text-[10px] opacity-60 font-normal">
                          {count.filtered}/{count.total}
                        </span>
                      )}
                    </div>
                    {isSelected ? (
                      <Check size={14} className="text-primary shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded border border-muted-foreground/30 group-hover/item:border-muted-foreground/60 shrink-0" />
                    )}
                  </button>
                );
              })}
              {filteredOptions.length === 0 && (
                <div className="py-8 text-center flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                    <Search size={14} className="text-muted-foreground/50" />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    No results found
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          {selected.length > 0 && (
            <div className="mt-1 pt-2 border-t border-border/50 px-1 flex justify-between items-center text-[10px]">
              <span className="text-muted-foreground pl-1">
                {selected.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-7 px-2 text-primary hover:bg-primary/5 hover:text-primary font-normal"
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TaskFilters() {
  const categories = Array.isArray(useTaskBoardStore((s) => s.categories))
    ? useTaskBoardStore((s) => s.categories)
    : [];
  const brands = Array.isArray(useTaskBoardStore((s) => s.brands))
    ? useTaskBoardStore((s) => s.brands)
    : [];
  const teams = Array.isArray(useTaskBoardStore((s) => s.teams))
    ? useTaskBoardStore((s) => s.teams)
    : [];
  const fetchTeams = useTaskBoardStore((s) => s.fetchTeams);
  const fetchBrands = useTaskBoardStore((s) => s.fetchBrands);

  const storeTasks = useTaskBoardStore((s) => s.tasks);
  const tasks = Array.isArray(storeTasks) ? storeTasks : [];

  const searchQuery = useTaskBoardStore((s) => s.searchQuery);
  const setSearchQuery = useTaskBoardStore((s) => s.setSearchQuery);

  const selectedTeams = useTaskBoardStore((s) => s.selectedTeams);
  const setSelectedTeams = useTaskBoardStore((s) => s.setSelectedTeams);

  const selectedCategories = useTaskBoardStore((s) => s.selectedCategories);
  const setSelectedCategories = useTaskBoardStore(
    (s) => s.setSelectedCategories,
  );

  const selectedBrands = useTaskBoardStore((s) => s.selectedBrands);
  const setSelectedBrands = useTaskBoardStore((s) => s.setSelectedBrands);

  // Fetch teams and brands from API once on mount
  useEffect(() => {
    fetchTeams();
    fetchBrands();
  }, [fetchTeams, fetchBrands]);

  const toggleFilter = (
    list: string[],
    setList: (v: string[]) => void,
    value: string,
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, { total: number; filtered: number }> = {};
    categories.forEach((cat) => (counts[cat.id] = { total: 0, filtered: 0 }));

    tasks.forEach((task) => {
      const isVisible = filterTask(
        task,
        searchQuery,
        selectedTeams,
        selectedCategories,
        selectedBrands,
      );

      if (task.categoryId && counts[task.categoryId]) {
        counts[task.categoryId].total++;
        if (isVisible) counts[task.categoryId].filtered++;
      }

      task.subtasks?.forEach((st) => {
        if (st.categoryId && counts[st.categoryId]) {
          counts[st.categoryId].total++;
          if (isVisible) counts[st.categoryId].filtered++;
        }
      });
    });
    return counts;
  }, [tasks, categories, searchQuery, selectedTeams, selectedCategories, selectedBrands]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, { total: number; filtered: number }> = {};
    brands.forEach((brand) => (counts[brand.id] = { total: 0, filtered: 0 }));

    tasks.forEach((task) => {
      const isVisible = filterTask(
        task,
        searchQuery,
        selectedTeams,
        selectedCategories,
        selectedBrands,
      );

      if (task.brand && counts[task.brand]) {
        counts[task.brand].total++;
        if (isVisible) counts[task.brand].filtered++;
      }

      task.subtasks?.forEach((st) => {
        if (st.brand && counts[st.brand]) {
          counts[st.brand].total++;
          if (isVisible) counts[st.brand].filtered++;
        }
      });
    });
    return counts;
  }, [tasks, brands, searchQuery, selectedTeams, selectedCategories, selectedBrands]);

  const teamCounts = useMemo(() => {
    const counts: Record<string, { total: number; filtered: number }> = {};
    teams.forEach((team) => (counts[team.id] = { total: 0, filtered: 0 }));

    tasks.forEach((task) => {
      const isVisible = filterTask(
        task,
        searchQuery,
        selectedTeams,
        selectedCategories,
        selectedBrands,
      );

      if (task.promotedTeam && counts[task.promotedTeam]) {
        counts[task.promotedTeam].total++;
        if (isVisible) counts[task.promotedTeam].filtered++;
      }

      task.subtasks?.forEach((st) => {
        if (st.team && counts[st.team]) {
          counts[st.team].total++;
          if (isVisible) counts[st.team].filtered++;
        }
      });
    });
    return counts;
  }, [tasks, teams, searchQuery, selectedTeams, selectedCategories, selectedBrands]);

  return (
    <div className="flex flex-col gap-3 px-2 py-2 bg-card rounded-xl border border-border/60 shadow-md mx-2 my-1 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 items-center flex-1">
          <FilterDropdown
            label="Categories"
            icon={TagIcon}
            options={categories}
            selected={selectedCategories}
            onToggle={(id: string) =>
              toggleFilter(selectedCategories, setSelectedCategories, id)
            }
            activeColorClass="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none"
            onReset={() => setSelectedCategories([])}
            counts={categoryCounts}
          />

          <FilterDropdown
            label="Teams"
            icon={Users}
            options={teams}
            selected={selectedTeams}
            onToggle={(id: string) =>
              toggleFilter(selectedTeams, setSelectedTeams, id)
            }
            activeColorClass="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none"
            onReset={() => setSelectedTeams([])}
            counts={teamCounts}
          />

          <FilterDropdown
            label="Brands"
            icon={Briefcase}
            options={brands}
            selected={selectedBrands}
            onToggle={(id: string) =>
              toggleFilter(selectedBrands, setSelectedBrands, id)
            }
            activeColorClass="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none"
            onReset={() => setSelectedBrands([])}
            counts={brandCounts}
          />

          {/* Selected Items summary badges */}
          <div className="flex flex-wrap gap-1.5 ml-2">
            {selectedCategories.length > 0 &&
              selectedCategories.length <= 3 &&
              categories
                .filter((c) => selectedCategories.includes(c.id))
                .map((c) => (
                  <Badge
                    key={c.id}
                    variant="outline"
                    className="bg-muted text-muted-foreground border-border py-0.5 text-xs font-medium"
                  >
                    {c.name}
                  </Badge>
                ))}
            {selectedTeams.length > 0 &&
              selectedTeams.length <= 3 &&
              teams
                .filter((t) => selectedTeams.includes(t.id))
                .map((t) => (
                  <Badge
                    key={t.id}
                    variant="outline"
                    className="bg-muted text-muted-foreground border-border py-0.5 text-xs font-medium"
                  >
                    {t.name}
                  </Badge>
                ))}
            {(selectedCategories.length > 3 ||
              selectedTeams.length > 3 ||
              selectedBrands.length > 3) && (
                <span className="text-sm text-muted-foreground italic self-center ml-1">
                  ...and more selected
                </span>
              )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg text-sm font-normal text-muted-foreground/60 uppercase tracking-widest border border-border/40 select-none">
          <Filter size={12} className="opacity-50" />
          Filters
        </div>
      </div>
    </div>
  );
}
