/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isLightTheme?: boolean;
}

export function GlassModal({ isOpen, onClose, title, icon, children, isLightTheme = false }: GlassModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${isLightTheme ? "bg-slate-900/20" : "bg-slate-950/40"}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className={`relative w-full max-w-5xl h-[85vh] flex flex-col rounded-3xl overflow-hidden decoration-none ${isLightTheme ? "light-glass text-slate-800 border bg-white/70 shadow-2xl" : "glass text-slate-100 border-white/20"}`}
      >
        {/* Glowing Ambient Backgrounds within the modal */}
        <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${isLightTheme ? "bg-cyan-500/5" : "bg-cyan-500/10"}`} />
        <div className={`absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${isLightTheme ? "bg-violet-500/5" : "bg-violet-500/10"}`} />

        {/* Modal Window Title bar with glass effect */}
        <div className={`flex items-center justify-between px-6 py-4 border-b z-10 ${isLightTheme ? "border-slate-200 bg-white/40" : "border-white/15 bg-white/5"} backdrop-blur-md`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border shadow-inner ${isLightTheme ? "bg-slate-100/80 border-slate-200 text-slate-800" : "bg-white/10 border-white/10 text-white"}`}>
              {icon}
            </div>
            <h2 className={`text-xl font-semibold tracking-tight ${isLightTheme ? "text-slate-900" : "text-white"}`}>
              {title}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            aria-label="Close"
            className={`p-2 rounded-full transition-all cursor-pointer ${isLightTheme ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200" : "text-white/60 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Window Content Area */}
        <div className={`flex-1 overflow-y-auto p-6 z-10 ${isLightTheme ? "text-slate-850" : "text-slate-100"}`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default GlassModal;
