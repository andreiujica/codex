"use client"

import { FileGrid } from "./file-grid";
import { FileList } from "./file-list";
import { useToolbarStore } from "@/stores/toolbar";

export function MainArea() {
  const { viewMode } = useToolbarStore();
  return (
    <>
      {viewMode === "grid" ? <FileGrid /> : <FileList />}
    </>
  )
}