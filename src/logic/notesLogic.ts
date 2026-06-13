/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { store } from "./explorerStore";
import { WorkspaceNote } from "../types";

export function useNotesController() {
  const notes = store.getState().notes;
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit Buffer
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const filteredNotes = useMemo(() => {
    return store.getState().notes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
      const contentMatch = note.content.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || contentMatch;
    });
  }, [store.getState().notes, searchTerm]);

  const selectedNote = useMemo(() => {
    const current = store.getState().notes.find((n) => n.id === selectedNoteId);
    if (current) {
      return current;
    }
    return store.getState().notes[0] || null;
  }, [selectedNoteId, store.getState().notes]);

  const selectNote = (note: WorkspaceNote | null) => {
    if (note) {
      setSelectedNoteId(note.id);
      setEditTitle(note.title);
      setEditContent(note.content);
    } else {
      setSelectedNoteId(null);
      setEditTitle("");
      setEditContent("");
    }
  };

  const handleAddNewNote = () => {
    store.addNote("Untitled Note", "Start typing your details here...");
    const newlyCreated = store.getState().notes[0];
    if (newlyCreated) {
      selectNote(newlyCreated);
    }
  };

  const handleSave = () => {
    if (!selectedNoteId) return;
    store.updateNote(selectedNoteId, editTitle, editContent);
  };

  const handleDelete = (id: string) => {
    store.deleteNote(id);
    if (selectedNoteId === id) {
      const remaining = store.getState().notes;
      if (remaining.length > 0) {
        selectNote(remaining[0]);
      } else {
        selectNote(null);
      }
    }
  };

  return {
    notes,
    filteredNotes,
    selectedNote,
    selectNote,
    searchTerm,
    setSearchTerm,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    handleAddNewNote,
    handleSave,
    handleDelete,
    updateNote: store.updateNote.bind(store),
  };
}
