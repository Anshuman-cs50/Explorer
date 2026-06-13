/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMessagingController } from "../logic/messagingLogic";
import { MessageSquare, Slack, Send, Hash, CornerDownRight } from "lucide-react";

export function MessagingWorkspace() {
  const m = useMessagingController();

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Controls */}
      <div className="w-1/4 flex flex-col gap-4 pr-4 border-r border-white/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 px-2">Workspaces</span>
        
        <div className="flex gap-2 p-1 bg-black/20 rounded-2xl border border-white/5">
          <button
            onClick={() => m.setActiveChannel("slack")}
            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              m.activeChannel === "slack"
                ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Slack className="w-3.5 h-3.5" /> Slack
          </button>
          
          <button
            onClick={() => m.setActiveChannel("whatsapp")}
            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              m.activeChannel === "whatsapp"
                ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </button>
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 px-2 mt-4">Active Threads</span>
        
        <div className="flex flex-col gap-1">
          {m.activeThread ? (
            <button
              onClick={() => m.setSelectedContact(m.activeThread!.contact)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-100 font-medium text-sm text-left transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-200 flex items-center justify-center font-bold text-xs ring-1 ring-white/10">
                {m.activeThread.avatar}
              </div>
              <div className="flex-1 truncate">
                <span className="block truncate">{m.activeThread.contact}</span>
                <span className="block text-[10px] text-white/40 truncate">
                  {m.activeThread.chats[m.activeThread.chats.length - 1]?.text || "No chats"}
                </span>
              </div>
            </button>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 bg-white/5 rounded-2xl border border-white/5">
              No threads found
            </div>
          )}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="flex-1 flex flex-col bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
        {m.activeThread ? (
          <>
            {/* Header info */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-200 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                  {m.activeThread.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{m.activeThread.contact}</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Active in Workspace
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-white/30 tracking-tight flex items-center gap-1">
                <Hash className="w-3 h-3" /> channeled-by-{m.activeChannel}
              </span>
            </div>

            {/* Chat list viewport */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {m.activeThread.chats.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[70%] ${
                    chat.sender === "me" ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <span className="text-[9px] text-slate-400 mb-1 px-1">{chat.sender === "me" ? "Me" : chat.sender}</span>
                  <div
                    className={`px-4 py-2.5 rounded-2xl border text-sm leading-relaxed ${
                      chat.sender === "me"
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-emerald-500/30 text-green-100 rounded-tr-none"
                        : "bg-white/10 border-white/10 text-white rounded-tl-none"
                    }`}
                  >
                    <p>{chat.text}</p>
                  </div>
                  <span className="text-[9px] text-white/30 mt-1 px-1">{chat.time}</span>
                </div>
              ))}
            </div>

            {/* Form Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/15 flex gap-2">
              <input
                type="text"
                placeholder={`Compile message for ${m.activeThread.contact}...`}
                value={m.typedMessage}
                onChange={(e) => m.setTypedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") m.handleSend();
                }}
                className="flex-grow px-4 py-3 rounded-xl bg-black/35 border border-white/10 focus:border-emerald-400 text-white placeholder-slate-500 outline-none text-sm transition-all"
              />
              <button
                onClick={m.handleSend}
                className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition-all cursor-pointer flex items-center justify-center border border-white/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <CornerDownRight className="w-12 h-12 opacity-35 mb-2" />
            <span className="text-xs">No active threads to render</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagingWorkspace;
