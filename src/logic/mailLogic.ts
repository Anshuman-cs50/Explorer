/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { EmailItem } from "../types";
import { store } from "./explorerStore";

export function useMailController() {
  const [activeFolder, setActiveFolder] = useState<"work" | "personal" | "archived">("work");
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  
  // Compose form state
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const filteredMails = useMemo(() => {
    const list = store.getState().emails;
    if (activeFolder === "archived") {
      return list.filter((m) => m.archived);
    }
    return list.filter((m) => m.folder === activeFolder && !m.archived);
  }, [activeFolder, store.getState().emails]);

  const selectedMail = useMemo(() => {
    return store.getState().emails.find((m) => m.id === selectedMailId) || null;
  }, [selectedMailId, store.getState().emails]);

  const handleSelectMail = (id: string) => {
    setSelectedMailId(id);
    store.markMailAsRead(id);
  };

  const handleArchive = (id: string) => {
    store.archiveMail(id);
    if (selectedMailId === id) {
      setSelectedMailId(null);
    }
  };

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo || !composeSubject || !composeBody) return;
    store.sendMail(composeTo, composeSubject, composeBody, activeFolder === "archived" ? "work" : activeFolder);
    
    // Reset compose
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setIsComposing(false);
  };

  return {
    activeFolder,
    setActiveFolder,
    selectedMail,
    filteredMails,
    isComposing,
    setIsComposing,
    composeTo,
    setComposeTo,
    composeSubject,
    setComposeSubject,
    composeBody,
    setComposeBody,
    handleSelectMail,
    handleArchive,
    handleSendCompose,
  };
}
