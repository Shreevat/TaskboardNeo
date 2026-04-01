"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskBoardStore } from "@/features/taskboard/store";
import { BoardSettingsDialog } from "@/features/taskboard/components/BoardSettings";

export function BoardHeader() {
  const exportJSON = useTaskBoardStore((s) => s.exportJSON);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target as Node)
      ) {
        setShowDownloadMenu(false);
      }
    };
    if (showDownloadMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDownloadMenu]);

  return (
    <div className="flex items-center justify-between px-2 py-2 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-2xl lg:text-4xl font-black tracking-tighter text-[#004098] uppercase">
        TASK BOARD
      </h1>

      <div className="flex items-center gap-2">
        {/* Download Menu Module */}
        <div className="relative" ref={downloadMenuRef}>
          <Button
            variant="ghost"
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="h-9 lg:h-10 lg:px-5 text-md-plus lg:text-lg font-bold text-white bg-[#1a5fb4] hover:bg-[#1a5fb4]/90 hover:text-white gap-2 transition-all shadow-sm uppercase tracking-wider"
          >
            <Download className="w-4 h-4 lg:w-5 lg:h-5" />
            Download
            <ChevronDown
              size={14}
              className={cn(
                "opacity-70 transition-transform duration-200",
                showDownloadMenu && "rotate-180",
              )}
            />
          </Button>
          {showDownloadMenu && (
            <div className="absolute top-full mt-2 right-0 w-36 bg-card border border-border rounded-xl shadow-2xl z-50 p-1.5 flex flex-col gap-1 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <button
                onClick={() => {
                  exportJSON();
                  setShowDownloadMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-lg text-left transition-colors"
              >
                <Download size={14} /> JSON File
              </button>
              <button
                onClick={() => {
                  useTaskBoardStore.getState().exportCSV();
                  setShowDownloadMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-[#00897b]/10 hover:text-[#00897b] rounded-lg text-left transition-colors"
              >
                <Download size={14} /> CSV Spreadsheet
              </button>
            </div>
          )}
        </div>

        <BoardSettingsDialog />
      </div>
    </div>
  );
}
