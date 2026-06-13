/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { store } from "../logic/explorerStore";
import { AppBubble } from "../types";
import { ShieldCheck, Plus, Link2, Info } from "lucide-react";

interface AddAppWorkspaceProps {
  onSuccess: () => void;
}

export function AddAppWorkspace({ onSuccess }: AddAppWorkspaceProps) {
  const moreApps = store.getState().availableMoreApps;
  const [selectedAppId, setSelectedAppId] = useState<string>(moreApps[0]?.id || "");
  const [apiKey, setApiKey] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedTemplate = moreApps.find((a) => a.id === selectedAppId);

  const handleAddIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    // Build the dynamic app bubble
    const newApp: AppBubble = {
      ...selectedTemplate,
      id: `${selectedTemplate.id}-${Date.now()}`, // unique ID
      category: "custom",
      notifications: Math.floor(Math.random() * 8) + 1, // mock some random notification alerts for volumetric rendering
      apiKey,
      apiUrl: apiUrl || selectedTemplate.placeholderUrl || "",
    };

    store.addCustomApp(newApp);

    setIsSuccess(true);
    setApiKey("");
    setApiUrl("");
    setTimeout(() => {
      setIsSuccess(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="flex h-full gap-6">
      {/* Templates Selector */}
      <div className="w-1/3 flex flex-col gap-2.5 pr-4 border-r border-white/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 px-2 mb-1">Select Service Template</span>
        {moreApps.map((t) => (
          <button
            key={t.id}
            onClick={() => { setSelectedAppId(t.id); setApiUrl(t.placeholderUrl || ""); }}
            className={`flex flex-col gap-1 px-4 py-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedAppId === t.id
                ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-200"
                : "bg-white/5 border-white/5 text-slate-350 hover:bg-white/10"
            }`}
          >
            <span className="font-bold text-sm tracking-tight">{t.name}</span>
            <span className="text-[10px] text-white/45 line-clamp-1">{t.description}</span>
          </button>
        ))}
      </div>

      {/* Integration Credentials Form fields */}
      <div className="flex-grow flex flex-col bg-white/5 p-6 rounded-3xl border border-white/10 overflow-hidden shadow-inner justify-center">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded-2xl flex items-center justify-center animate-bounce">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Integration Successful!</h4>
            <span className="text-xs text-slate-400">Dynamic bubble initialized on your home canvas</span>
          </div>
        ) : selectedTemplate ? (
          <form onSubmit={handleAddIntegration} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-black/25 border border-white/5 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5 leading-tight">
                <Info className="w-3.5 h-3.5 text-cyan-300" /> Connecting {selectedTemplate.name}
              </span>
              <p className="text-slate-350 leading-relaxed mt-1 text-[11px]">{selectedTemplate.description}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Target API Endpoint URL</label>
              <input
                type="url"
                required
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder={selectedTemplate.placeholderUrl}
                className="w-full px-4 py-2.5 bg-black/25 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Secured API Key / Token Authentication</label>
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste account credentials token..."
                className="w-full px-4 py-2.5 bg-black/25 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="mt-3 w-full flex justify-center items-center gap-1.5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs cursor-pointer transition-all border border-white/10 shadow-lg"
            >
              <Plus className="w-4 h-4" /> Link secure {selectedTemplate.name}
            </button>
          </form>
        ) : (
          <div className="text-center text-xs text-slate-400">Select templates to begin setup</div>
        )}
      </div>
    </div>
  );
}

export default AddAppWorkspace;
