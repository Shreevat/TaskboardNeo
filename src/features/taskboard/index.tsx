"use client";

import dynamic from "next/dynamic";

const BoardView = dynamic(
  () => import("@/features/taskboard/components/BoardView"),
  { ssr: false },
);

export default BoardView;
