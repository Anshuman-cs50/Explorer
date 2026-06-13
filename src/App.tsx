/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { store } from "./logic/explorerStore";
import { AppBubble } from "./types";

// Workspaces
import { BubbleCanvas } from "./components/BubbleCanvas";
import { GlassModal } from "./components/GlassModal";
import { MailWorkspace } from "./components/MailWorkspace";
import { MediaWorkspace } from "./components/MediaWorkspace";
import { MessagingWorkspace } from "./components/MessagingWorkspace";
import { GithubWorkspace } from "./components/GithubWorkspace";
import { DashboardWorkspace } from "./components/DashboardWorkspace";
import { NotesWorkspace } from "./components/NotesWorkspace";
import { CalendarWorkspace } from "./components/CalendarWorkspace";
import { AddAppWorkspace } from "./components/AddAppWorkspace";

// Utility Icons
import { Compass, Mail, Image, MessageSquare, Github, BarChart3, FileText, Calendar, Plus, Sun, Moon, Bell } from "lucide-react";

const WORKSPACE_ICON_MAP: Record<string, any> = {
  mail: <Mail className="w-5 h-5 text-cyan-300" />,
  media: <Image className="w-5 h-5 text-purple-300" />,
  messaging: <MessageSquare className="w-5 h-5 text-green-300" />,
  github: <Github className="w-5 h-5 text-indigo-300" />,
  dashboard: <BarChart3 className="w-5 h-5 text-amber-300" />,
  notes: <FileText className="w-5 h-5 text-teal-300" />,
  calendar: <Calendar className="w-5 h-5 text-rose-300" />,
  custom: <Compass className="w-5 h-5 text-slate-350" />,
};

export default function App() {
  const [, setTick] = useState(0); // For store subscription updates
  const [activeWorkspace, setActiveWorkspace] = useState<{ category: AppBubble["category"]; app: AppBubble } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(() => {
    return localStorage.getItem("explorer_theme") === "light";
  });

  const [customSettings, setCustomSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("explorer_custom_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { stopBreathing: false, volumetricSizing: true };
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Subscribe to central OOP store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const toggleTheme = () => {
    const nextVal = !isLightTheme;
    setIsLightTheme(nextVal);
    localStorage.setItem("explorer_theme", nextVal ? "light" : "dark");
  };

  const updateSetting = (key: "stopBreathing" | "volumetricSizing", value: boolean) => {
    const updated = { ...customSettings, [key]: value };
    setCustomSettings(updated);
    localStorage.setItem("explorer_custom_settings", JSON.stringify(updated));
  };

  const totalNotifications = store.getState().apps.reduce((acc, app) => acc + app.notifications, 0);

  const handleOpenApp = (category: AppBubble["category"], app: AppBubble) => {
    setActiveWorkspace({ category, app });
  };

  const renderActiveWorkspace = () => {
    if (!activeWorkspace) return null;
    switch (activeWorkspace.category) {
      case "mail":
        return <MailWorkspace />;
      case "media":
        return <MediaWorkspace />;
      case "messaging":
        return <MessagingWorkspace />;
      case "github":
        return <GithubWorkspace />;
      case "dashboard":
        return <DashboardWorkspace />;
      case "notes":
        return <NotesWorkspace />;
      case "calendar":
        return <CalendarWorkspace />;
      default:
        // Render fallback interface for newly added credential apps
        return (
          <div className={`flex flex-col items-center justify-center py-16 text-center gap-4 border rounded-3xl p-8 ${isLightTheme ? "bg-white/80 border-slate-250" : "bg-white/5 border-white/5"}`}>
            <Compass className="w-12 h-12 text-slate-400 animate-spin" style={{ animationDuration: "12s" }} />
            <div>
              <h3 className={`font-bold text-lg ${isLightTheme ? "text-slate-900" : "text-white"}`}>Logged in to {activeWorkspace.app.name}</h3>
              <p className={`text-xs mt-1 max-w-md mx-auto ${isLightTheme ? "text-slate-600" : "text-slate-350"}`}>
                Successfully connected utilizing authorization endpoint below. In-page sessions are secured and isolated.
              </p>
            </div>
            <div className={`w-full max-w-lg mt-2 p-4 rounded-xl border text-[11px] font-mono select-all flex flex-col gap-1.5 align-left text-left ${isLightTheme ? "bg-slate-100/90 text-slate-800 border-slate-200" : "bg-black/35 text-slate-300 border-white/5"}`}>
              <span>ROOT_API_URL: {activeWorkspace.app.apiUrl}</span>
              <span>BEARER_TOKEN: binder {activeWorkspace.app.apiKey?.slice(0, 10)}...*****************</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col select-none transition-colors duration-500 ${isLightTheme ? "explorer-bg-light text-slate-800" : "explorer-bg text-slate-100"}`}>
      {/* Decorative ambient orbiting blurs */}
      <div className={`blob blob-1 transition-all duration-700 ${isLightTheme ? "bg-sky-400 opacity-20" : "bg-blue-500 opacity-40"}`} />
      <div className={`blob blob-2 transition-all duration-700 ${isLightTheme ? "bg-purple-400 opacity-20" : "bg-purple-500 opacity-40"}`} />

      {/* Sleek, top-pinned full-width navbar style header */}
      <header className={`w-full py-3.5 px-6 md:px-12 flex items-center justify-between z-10 border-b transition-all duration-300 backdrop-blur-md ${isLightTheme ? "bg-white/40 border-slate-200/50 shadow-sm" : "bg-slate-950/20 border-white/10 shadow-lg"}`}>
        {/* Left Section: Branding & Description */}
        <div className="flex flex-col text-left">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className={`${isLightTheme ? "text-slate-900" : "text-white"}`}>Explorer</span>
            <span className={`font-mono text-[10px] md:text-xs font-bold border px-2.5 py-0.5 rounded-full backdrop-blur-sm transition-all duration-300 ${isLightTheme ? "text-cyan-600 border-cyan-200 bg-cyan-100/40" : "text-cyan-400 border-white/20 bg-white/5"}`}>
              WORKSPACE
            </span>
          </h1>
          <p className={`text-xs mt-0.5 transition-colors duration-300 ${isLightTheme ? "text-slate-600" : "text-slate-300"}`}>
            Unified material, metrics, and message environments
          </p>
        </div>

        {/* Right Section: Theme Toggle and Circular Account Profile */}
        <div className="flex items-center gap-3">
          {/* Unchecked notifications indicator - Bell Icon with Badge */}
          <div className="relative">
            <button
              className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-default ${isLightTheme ? "light-glass text-slate-800 border-slate-300 bg-slate-100/40" : "glass text-slate-300 border-white/20 bg-white/5"}`}
              aria-label="No major notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-lg animate-pulse">
                {totalNotifications}
              </span>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${isLightTheme ? "light-glass text-slate-800 hover:bg-slate-200/40 border-slate-300" : "glass text-slate-300 hover:text-white hover:bg-white/10 border-white/20"}`}
            aria-label="Toggle theme"
          >
            {isLightTheme ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Circular Account Profile & Customize Dropdown container */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm tracking-tight border transition-all duration-300 cursor-pointer ${isLightTheme ? "light-glass text-slate-800 border-slate-300 shadow-sm hover:bg-slate-100" : "glass text-white border-white/20 hover:bg-white/10"}`}
            >
              JD
            </button>

            {/* Customize option Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <div className={`absolute right-0 mt-3.5 w-64 rounded-2xl p-4 border shadow-2xl z-50 text-left transition-all duration-300 ${isLightTheme ? "bg-white/95 border-slate-250 text-slate-800 light-glass" : "bg-slate-900/95 border-white/15 text-slate-100 glass"}`}>
                  <div className="border-b pb-2 mb-3 border-slate-200/40 transition-colors duration-300">
                    <span className="text-[10px] font-extrabold text-cyan-500 block uppercase tracking-wider">Account Workspace</span>
                    <span className="font-bold text-sm block">john_doe_99</span>
                  </div>

                  <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-wider mb-2.5">customize options</span>
                  
                  <div className="flex flex-col gap-3">
                    {/* Switch: Stop Breathing movement */}
                    <label className="flex items-center justify-between cursor-pointer group text-xs text-left">
                      <span className="select-none pr-2 font-medium">Stop breathing motion</span>
                      <input
                        type="checkbox"
                        checked={customSettings.stopBreathing}
                        onChange={(e) => updateSetting("stopBreathing", e.target.checked)}
                        className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500 h-4 w-4 cursor-pointer accent-cyan-500"
                      />
                    </label>

                    {/* Switch: Volumetric Sizing */}
                    <label className="flex items-center justify-between cursor-pointer group text-xs text-left">
                      <span className="select-none pr-2 font-medium">Volumetric sizing active</span>
                      <input
                        type="checkbox"
                        checked={customSettings.volumetricSizing}
                        onChange={(e) => updateSetting("volumetricSizing", e.target.checked)}
                        className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500 h-4 w-4 cursor-pointer accent-cyan-500"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Bubble Constellation Canvas with padding wrapper to occupy full remaining space */}
      <main className="flex-1 w-full p-4 md:p-6 z-10 overflow-hidden">
        <BubbleCanvas
          onOpenApp={handleOpenApp}
          onOpenAddApp={() => setIsAddOpen(true)}
          isLightTheme={isLightTheme}
          stopBreathing={customSettings.stopBreathing}
          volumetricSizing={customSettings.volumetricSizing}
        />
      </main>

      {/* App modal workspace */}
      <GlassModal
        isOpen={activeWorkspace !== null}
        onClose={() => setActiveWorkspace(null)}
        title={activeWorkspace?.app.name || ""}
        icon={WORKSPACE_ICON_MAP[activeWorkspace?.category || "custom"]}
        isLightTheme={isLightTheme}
      >
        {renderActiveWorkspace()}
      </GlassModal>

      {/* Custom app dynamic creation modal */}
      <GlassModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Dynamic Integration"
        icon={<Plus className="w-5 h-5 text-cyan-300" />}
        isLightTheme={isLightTheme}
      >
        <AddAppWorkspace onSuccess={() => setIsAddOpen(false)} />
      </GlassModal>
    </div>
  );
}
