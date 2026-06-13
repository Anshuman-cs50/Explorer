/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { MediaItem } from "../types";
import { store } from "./explorerStore";

export function useMediaController() {
  const [activeSource, setActiveSource] = useState<"google-photos" | "local" | "all">("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [migrationItemId, setMigrationItemId] = useState<string | null>(null);
  const [migrationProgress, setMigrationProgress] = useState<number>(0);
  const [newGroupName, setNewGroupName] = useState("");

  const mediaList = store.getState().multimedia;

  const groupsList = useMemo(() => {
    const list = new Set<string>();
    mediaList.forEach((m) => {
      if (m.group) list.add(m.group);
    });
    return Array.from(list);
  }, [mediaList]);

  const filteredMedia = useMemo(() => {
    return mediaList.filter((m) => {
      const matchSource = activeSource === "all" || m.source === activeSource;
      const matchGroup = selectedGroup === "all" || m.group === selectedGroup;
      return matchSource && matchGroup;
    });
  }, [activeSource, selectedGroup, mediaList]);

  const handleDelete = (id: string) => {
    store.deleteMediaItem(id);
  };

  const startMigration = (id: string, currentSource: "google-photos" | "local") => {
    if (migrationItemId) return; // one at a time
    const targetSource = currentSource === "google-photos" ? "local" : "google-photos";
    setMigrationItemId(id);
    setMigrationProgress(5);

    const interval = setInterval(() => {
      setMigrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          store.migrateMediaSource(id, targetSource);
          setMigrationItemId(null);
          return 0;
        }
        return prev + 15;
      });
    }, 150);
  };

  const handleUpdateGroup = (id: string, groupName: string) => {
    if (!groupName) return;
    store.setMediaGroup(id, groupName);
  };

  return {
    activeSource,
    setActiveSource,
    selectedGroup,
    setSelectedGroup,
    groupsList,
    filteredMedia,
    handleDelete,
    migrationItemId,
    migrationProgress,
    startMigration,
    newGroupName,
    setNewGroupName,
    handleUpdateGroup,
  };
}
