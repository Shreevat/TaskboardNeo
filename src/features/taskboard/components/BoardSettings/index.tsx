import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ColumnsTab } from "@/features/taskboard/components/BoardSettings/Tabs/ColumnsTab";
import { CategoriesTab } from "@/features/taskboard/components/BoardSettings/Tabs/CategoriesTab";
import { BrandsTab } from "@/features/taskboard/components/BoardSettings/Tabs/BrandsTab";
import { TeamsTab } from "@/features/taskboard/components/BoardSettings/Tabs/TeamsTab";
import { AppearanceTab } from "@/features/taskboard/components/BoardSettings/Tabs/AppearanceTab";
import { ConfirmDialog } from "@/features/taskboard/components/BoardSettings/Dialogs/ConfirmDialog";

type Tab = "columns" | "categories" | "brands" | "teams" | "board";

export function BoardSettingsDialog() {
  const [activeTab, setActiveTab] = useState<Tab>("columns");
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(
    null,
  );

  return (
    <>
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              className="h-9 lg:h-10 lg:px-5 text-md-plus lg:text-lg font-bold text-white bg-[#00897b] hover:bg-[#00897b]/90 hover:text-white gap-2 transition-all shadow-sm border-none uppercase tracking-wider"
            >
              <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
              Board Settings
            </Button>
          }
        />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Board Settings</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 border-b border-border mb-4">
            {(["columns", "categories", "brands", "teams", "board"] as Tab[]).map(
              (tab) => (
                <button
                  key={tab}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors border-b-2 capitalize",
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          <div className="flex flex-col gap-6 py-4 min-h-[400px]">
            {activeTab === "columns" && <ColumnsTab onAlert={setAlert} />}
            {activeTab === "categories" && <CategoriesTab />}
            {activeTab === "brands" && <BrandsTab />}
            {activeTab === "teams" && <TeamsTab />}
            {activeTab === "board" && <AppearanceTab />}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog alert={alert} onClose={() => setAlert(null)} />
    </>
  );
}
