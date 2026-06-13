/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { store } from "../logic/explorerStore";
import { AppBubble } from "../types";
import { WorkspaceBubble } from "../logic/bubbleClasses";
import { BubbleNode } from "./BubbleNode";
import { Plus } from "lucide-react";

interface BubbleCanvasProps {
  onOpenApp: (category: AppBubble["category"], bubble: AppBubble) => void;
  onOpenAddApp: () => void;
  isLightTheme: boolean;
  stopBreathing: boolean;
  volumetricSizing: boolean;
}

export function BubbleCanvas({
  onOpenApp,
  onOpenAddApp,
  isLightTheme,
  stopBreathing,
  volumetricSizing
}: BubbleCanvasProps) {
  const apps = store.getState().apps;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Instantiating parent apps inside clean OOP workspace bubbles
  const workspaceBubbles = useMemo(() => {
    return apps.map((app) => new WorkspaceBubble(app));
  }, [apps]);

  // Position coordinates to place bubbles beautifully in space
  const bubbleCoordinates = useMemo(() => {
    return [
      { x: "18%", y: "24%" },
      { x: "46%", y: "16%" },
      { x: "74%", y: "24%" },
      { x: "20%", y: "62%" },
      { x: "47%", y: "52%" },
      { x: "74%", y: "62%" },
      { x: "47%", y: "84%" },
      { x: "12%", y: "44%" },
      { x: "82%", y: "44%" },
      { x: "32%", y: "76%" },
      { x: "62%", y: "76%" },
    ];
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-transparent">
      {/* Grid lines */}
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none transition-opacity duration-300 ${isLightTheme ? "opacity-10 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)]" : "opacity-30"}`} />

      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        {workspaceBubbles.map((bubble, index) => {
          const coords = bubbleCoordinates[index % bubbleCoordinates.length];
          return (
            <BubbleNode
              key={bubble.id}
              bubble={bubble}
              coords={coords}
              index={index}
              onOpenApp={onOpenApp}
              isLightTheme={isLightTheme}
              stopBreathing={stopBreathing}
              volumetricSizing={volumetricSizing}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              apps={apps}
              containerRef={containerRef}
            />
          );
        })}

        {/* Dynamic add app button relocated elegantly to bottom-right corner of the canvas */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-30 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAddApp}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border cursor-pointer transition-all select-none ${isLightTheme ? "bg-white/90 hover:bg-white border-slate-300/80 text-slate-700 hover:text-slate-900" : "glass text-white/70 border-white/10 hover:text-white hover:bg-white/10"}`}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          <span className={`text-[8px] font-bold uppercase tracking-wider mt-1.5 transition-colors duration-300 ${isLightTheme ? "text-slate-600" : "text-white/50"}`}>
            add
          </span>
        </div>
      </div>
    </div>
  );
}

export default BubbleCanvas;
