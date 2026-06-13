/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNotesController } from "../logic/notesLogic";
import { Plus, Trash2, Search, FileText, Check, PenTool } from "lucide-react";

export function NotesWorkspace() {
  const n = useNotesController();

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Controls */}
      <div className="w-1/3 flex flex-col gap-3 pr-4 border-r border-white/10">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/40">My Offline Notes</span>
          <button
            onClick={n.handleAddNewNote}
            className="p-1 px-2.5 rounded-lg text-xs bg-teal-500 hover:bg-teal-400 text-white font-medium flex items-center gap-1 cursor-pointer transition-all border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" /> Note
          </button>
        </div>

        {/* Search Input bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search notes body..."
            value={n.searchTerm}
            onChange={(e) => n.setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/25 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
          />
        </div>

        {/* Note List item grids */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {n.filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 bg-white/5 rounded-2xl border border-white/5">
              No matching notes found
            </div>
          ) : (
            n.filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => n.selectNote(note)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  n.selectedNote?.id === note.id
                    ? "bg-teal-500/20 border-teal-400/40 text-teal-200"
                    : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <span className="font-bold text-sm truncate flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-teal-300" /> {note.title || "Untitled"}
                </span>
                <p className="text-xs text-slate-350 line-clamp-2 leading-relaxed">{note.content}</p>
                <div className="flex justify-between items-center mt-1 text-[9px] text-white/30">
                  <span>{note.updatedAt}</span>
                  <div className="flex items-center gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete note?")) n.handleDelete(note.id);
                      }}
                      className="p-1 hover:bg-red-500/10 text-red-400 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col gap-4 overflow-hidden shadow-inner">
        {n.selectedNote ? (
          <>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 flex-grow pr-4">
                <PenTool className="w-4 h-4 text-teal-300" />
                <input
                  type="text"
                  placeholder="Note Title Heading"
                  value={n.editTitle}
                  onChange={(e) => {
                    n.setEditTitle(e.target.value);
                    // Autosave changes
                    n.updateNote(n.selectedNote!.id, e.target.value, n.editContent);
                  }}
                  className="bg-transparent border-none text-white font-bold text-lg focus:outline-none w-full"
                />
              </div>
              
              <button
                onClick={n.handleSave}
                className="px-3.5 py-1.5 rounded-xl text-xs bg-teal-500 hover:bg-teal-400 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10 shadow-md"
              >
                <Check className="w-3.5 h-3.5" /> Saved
              </button>
            </div>

            <textarea
              placeholder="Start drafting notes detailing workflows, goals, ideas..."
              value={n.editContent}
              onChange={(e) => {
                n.setEditContent(e.target.value);
                // Autosave changes
                n.updateNote(n.selectedNote!.id, n.editTitle, e.target.value);
              }}
              className="flex-grow p-1 bg-transparent border-none text-slate-100 text-sm leading-relaxed focus:outline-none resize-none"
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <FileText className="w-12 h-12 opacity-30 mb-2" />
            <span className="text-xs">No active notes selected</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesWorkspace;
