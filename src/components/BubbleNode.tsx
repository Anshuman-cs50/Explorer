/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, RefObject } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppBubble } from "../types";
import { WorkspaceBubble } from "../logic/bubbleClasses";
import {
  Mail, Inbox, User, Image, Cloud, HardDrive, MessageSquare, MessageCircle, Phone,
  Github, FolderGit, AlertCircle, BarChart3, TrendingUp, DollarSign, FileText,
  PenTool, CheckSquare, Calendar, Clock, Bell, HelpCircle
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Mail, Inbox, User, Image, Cloud, HardDrive, MessageSquare, MessageCircle, Phone,
  Github, FolderGit, AlertCircle, BarChart3, TrendingUp, DollarSign, FileText,
  PenTool, CheckSquare, Calendar, Clock, Bell, HelpCircle
};

interface BubbleNodeProps {
  key?: any;
  bubble: WorkspaceBubble;
  coords: { x: string; y: string };
  index: number;
  onOpenApp: (category: AppBubble["category"], bubble: AppBubble) => void;
  isLightTheme: boolean;
  stopBreathing: boolean;
  volumetricSizing: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  apps: AppBubble[];
  containerRef: RefObject<HTMLDivElement>;
}

export function BubbleNode({
  bubble,
  coords,
  index,
  onOpenApp,
  isLightTheme,
  stopBreathing,
  volumetricSizing,
  hoveredId,
  setHoveredId,
  apps,
  containerRef
}: BubbleNodeProps) {
  const [isVibrating, setIsVibrating] = useState(false);
  const isDraggingRef = useRef(false);

  // Periodic staggered vibration effect for bubbles with active notifications
  useEffect(() => {
    if (bubble.notifications > 0) {
      const interval = setInterval(() => {
        const timeout = setTimeout(() => {
          setIsVibrating(true);
          // Vibrate for 700ms then stop
          const stopTimeout = setTimeout(() => setIsVibrating(false), 700);
          return () => clearTimeout(stopTimeout);
        }, index * 40); // 40ms stagger delay

        return () => clearTimeout(timeout);
      }, 7500); // Runs once every 7-8 seconds

      return () => clearInterval(interval);
    }
  }, [bubble.notifications, index]);

  const calculatedSize = useMemo(() => {
    return bubble.getVolumeSize(60, 10, volumetricSizing);
  }, [bubble, volumetricSizing]);

  const IconComp = ICON_MAP[bubble.icon] || Mail;

  const isSomeHovered = hoveredId !== null;
  const isMeHovered = hoveredId === bubble.id;
  const targetOpacity = !isSomeHovered ? "opacity-100 scale-100" : isMeHovered ? "opacity-100 scale-105" : "opacity-30 scale-95 duration-500";
  const labelOpacity = !isSomeHovered ? "opacity-100 scale-105" : isMeHovered ? "opacity-100 scale-100" : "opacity-30 blur-[0.5px] scale-95 duration-500";

  const finalTextColor = isLightTheme
    ? (bubble.textColor || "text-slate-850")
        .replace("-200", "-700")
        .replace("-300", "-800")
        .replace("text-white", "text-slate-900")
    : bubble.textColor || "text-slate-200";

  // Build breathing or vibrating translation paths
  const getYAnimation = () => {
    if (isVibrating) return [0, -2, 2, -1.5, 1.5, -1, 1, 0];
    if (stopBreathing) return 0;
    return [0, -4, 0, 4, 0];
  };

  const getXAnimation = () => {
    if (isVibrating) return [0, 2, -2, 1.5, -1.5, 1, -1, 0];
    return 0;
  };

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      dragElastic={0.12}
      whileDrag={{ scale: 1.04 }}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        // Brief timeout ensures click handler registers state before switching off
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 100);
      }}
      style={{
        left: coords.x,
        top: coords.y,
        marginLeft: -calculatedSize / 2,
        marginTop: -calculatedSize / 2,
        width: calculatedSize
      }}
      className={`absolute flex flex-col items-center cursor-grab active:cursor-grabbing transition-shadow duration-300 ${isMeHovered ? "z-30" : "z-10"}`}
      onMouseEnter={() => setHoveredId(bubble.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Outer child satellite circular bubble animations - OOP children inheriting similar layout */}
      <AnimatePresence>
        {isMeHovered && bubble.childBubbles.length > 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] pointer-events-none flex items-center justify-center z-20">
            {bubble.childBubbles.map((child, cIdx) => {
              let angle;
              if (bubble.childBubbles.length === 1) {
                angle = -Math.PI / 2; // 12:00 o'clock
              } else {
                // Map exactly from 11:00 (-120 deg) to 2:00 (-30 deg)
                const minAngle = -120 * Math.PI / 180;
                const maxAngle = -30 * Math.PI / 180;
                angle = minAngle + (cIdx * (maxAngle - minAngle)) / (bubble.childBubbles.length - 1);
              }
              
              const childSize = child.getVolumeSize();
              const rad = (calculatedSize / 2) + (childSize / 2) + 20;

              const cx = Math.cos(angle) * rad;
              const cy = Math.sin(angle) * rad;
              const ChildIcon = ICON_MAP[child.icon] || HelpCircle;

              return (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x: cx, y: cy }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 20 }}
                  className="absolute pointer-events-auto flex flex-col items-center group cursor-pointer z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDraggingRef.current) return;
                    const rawApp = apps.find(a => a.id === bubble.id);
                    if (rawApp) onOpenApp(rawApp.category, rawApp);
                  }}
                >
                  <div
                    style={{ width: childSize, height: childSize }}
                    className={`flex items-center justify-center rounded-full bg-gradient-to-br ${child.color} border transition-all duration-300 ${isLightTheme ? "light-glass border-slate-300/60 shadow-sm" : "glass border-white/20 shadow-md"} text-center`}
                  >
                    <ChildIcon className={`w-3.5 h-3.5 ${finalTextColor}`} />
                  </div>
                  <span className={`text-[8px] font-medium tracking-normal mt-1 px-1 rounded backdrop-blur-sm whitespace-nowrap transition-colors duration-300 ${isLightTheme ? "text-slate-800 bg-white/50" : "text-slate-200 bg-black/30"}`}>
                    {child.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main parent bubble container */}
      <div className="flex flex-col items-center relative select-none">
        <motion.div
          animate={{
            y: getYAnimation(),
            x: getXAnimation()
          }}
          transition={{
            repeat: isVibrating ? 1 : Infinity,
            duration: isVibrating ? 0.08 : (5 + (index % 3)),
            ease: "easeInOut"
          }}
          onClick={() => {
            if (isDraggingRef.current) return;
            const rawApp = apps.find(a => a.id === bubble.id);
            if (rawApp) onOpenApp(rawApp.category, rawApp);
          }}
          style={{ width: calculatedSize, height: calculatedSize }}
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${bubble.color} select-none cursor-pointer transition-all duration-300 ${isLightTheme ? "light-glass border-slate-200/50 shadow-md hover:bg-white/80" : "glass border-white/10 shadow-lg hover:bg-white/5"} ${targetOpacity}`}
        >
          <IconComp className={`w-4 h-4 filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)] ${finalTextColor}`} />

          {bubble.hasNotifications() && (
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 border border-white/20 text-[8px] font-bold text-white shadow-lg animate-pulse">
              {bubble.notifications}
            </span>
          )}
        </motion.div>

        {/* Regular body non-bold lowercase text name for the bubble */}
        <span className={`text-xs mt-1.5 font-normal tracking-wide transition-all duration-300 whitespace-nowrap ${isLightTheme ? "text-slate-800" : "text-slate-350"} ${labelOpacity}`}>
          {bubble.name}
        </span>
      </div>
    </motion.div>
  );
}
