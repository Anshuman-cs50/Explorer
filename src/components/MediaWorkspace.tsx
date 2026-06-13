/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMediaController } from "../logic/mediaLogic";
import { Folder, Trash2, Globe, Laptop, RefreshCw, Layers, Plus } from "lucide-react";

export function MediaWorkspace() {
  const m = useMediaController();

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Controls */}
      <div className="w-1/4 flex flex-col gap-2 pr-4 border-r border-white/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 px-2 mb-1">Sources</span>
        
        <button
          onClick={() => m.setActiveSource("all")}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
            m.activeSource === "all"
              ? "bg-purple-500/20 border-purple-400/40 text-purple-200"
              : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Layers className="w-4 h-4" /> All Materials
        </button>
        <button
          onClick={() => m.setActiveSource("google-photos")}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
            m.activeSource === "google-photos"
              ? "bg-purple-500/20 border-purple-400/40 text-purple-200"
              : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Globe className="w-4 h-4" /> Google Photos Cloud
        </button>
        <button
          onClick={() => m.setActiveSource("local")}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
            m.activeSource === "local"
              ? "bg-purple-500/20 border-purple-400/40 text-purple-200"
              : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Laptop className="w-4 h-4" /> Local Disk Drive
        </button>

        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 px-2 mt-6 mb-1">Groups</span>
        <button
          onClick={() => m.setSelectedGroup("all")}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
            m.selectedGroup === "all" ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
          }`}
        >
          All Categories
        </button>
        {m.groupsList.map((group) => (
          <button
            key={group}
            onClick={() => m.setSelectedGroup(group)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
              m.selectedGroup === group ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-purple-300" /> {group}
          </button>
        ))}
      </div>

      {/* Main Material Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
          <span className="text-xs text-slate-350">
            Showing <strong className="text-purple-300">{m.filteredMedia.length}</strong> items in workspace
          </span>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="New Group Name"
              value={m.newGroupName}
              onChange={(e) => m.setNewGroupName(e.target.value)}
              className="px-3 py-1 bg-black/30 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <span className="text-xs text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer transition-all">
              <Plus className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="flex-grow grid grid-cols-2 gap-4 overflow-y-auto pr-2">
          {m.filteredMedia.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex flex-col hover:border-purple-500/20 transition-all shadow-inner"
            >
              {/* Media Thumbnail/Visual */}
              <div className="relative h-44 overflow-hidden bg-black/40 flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 pointer-events-none"
                />
                
                {/* Source Emblem Badge */}
                <span className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white">
                  {item.source === "google-photos" ? (
                    <><Globe className="w-2.5 h-2.5 text-cyan-400" /> Photos API</>
                  ) : (
                    <><Laptop className="w-2.5 h-2.5 text-amber-400" /> Local storage</>
                  )}
                </span>

                {/* Simulated Migration Progress Bar */}
                {m.migrationItemId === item.id && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                    <RefreshCw className="w-6 h-6 animate-spin text-purple-300 mb-2" />
                    <span className="text-xs text-purple-200">Migrating workspace...</span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        style={{ width: `${m.migrationProgress}%` }}
                        className="bg-purple-400 h-full transition-all duration-100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Media Card Metadata */}
              <div className="p-3.5 flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-white truncate text-sm">{item.name}</span>
                  <span className="text-[10px] text-white/50 whitespace-nowrap">{item.size}</span>
                </div>
                
                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70">
                      {item.group}
                    </span>
                    <button
                      onClick={() => {
                        if (m.newGroupName) {
                          m.handleUpdateGroup(item.id, m.newGroupName);
                          m.setNewGroupName("");
                        }
                      }}
                      className="text-[10px] text-purple-300 hover:underline"
                    >
                      Apply Group
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => m.startMigration(item.id, item.source)}
                      title="Migrate source location"
                      className="p-1 px-2 rounded-md hover:bg-white/10 text-slate-350 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Migrate</span>
                    </button>
                    <button
                      onClick={() => m.handleDelete(item.id)}
                      title="Delete material"
                      className="p-1 rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MediaWorkspace;
