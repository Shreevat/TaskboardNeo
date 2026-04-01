import { useState, useRef } from "react";
import { Task, Id } from "@/features/taskboard/types";

export function useTaskCardState(task: Task) {
  const [activeSubtaskEdit, setActiveSubtaskEdit] = useState<Id | null>(null);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(task.title || "");
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeSubtaskHistory, setActiveSubtaskHistory] = useState<Id | null>(
    null,
  );
  const [subtaskInput, setSubtaskInput] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [subtaskCommentInput, setSubtaskCommentInput] = useState("");
  const [showTaskComments, setShowTaskComments] = useState(false);
  const [showPromoted, setShowPromoted] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [activeSubtaskComments, setActiveSubtaskComments] = useState<Id | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return {
    activeSubtaskEdit,
    setActiveSubtaskEdit,
    addingSubtask,
    setAddingSubtask,
    showColorPicker,
    setShowColorPicker,
    isEditingTitle,
    setIsEditingTitle,
    titleInput,
    setTitleInput,
    showHistory,
    setShowHistory,
    showDeleteConfirm,
    setShowDeleteConfirm,
    activeSubtaskHistory,
    setActiveSubtaskHistory,
    subtaskInput,
    setSubtaskInput,
    isCollapsed,
    setIsCollapsed,
    subtaskCommentInput,
    setSubtaskCommentInput,
    showTaskComments,
    setShowTaskComments,
    showPromoted,
    setShowPromoted,
    historySearch,
    setHistorySearch,
    activeSubtaskComments,
    setActiveSubtaskComments,
    inputRef,
  };
}
