/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMailController } from "../logic/mailLogic";
import { Mail, Inbox, Archive, Send, Compass, CheckCircle } from "lucide-react";

export function MailWorkspace() {
  const c = useMailController();

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Controls */}
      <div className="w-1/4 flex flex-col gap-2 pr-4 border-r border-white/10">
        <button
          onClick={() => { c.setActiveFolder("work"); c.setIsComposing(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
            c.activeFolder === "work" && !c.isComposing
              ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-200"
              : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Inbox className="w-4 h-4" /> Work Mails
        </button>
        <button
          onClick={() => { c.setActiveFolder("personal"); c.setIsComposing(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
            c.activeFolder === "personal" && !c.isComposing
              ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-200"
              : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Compass className="w-4 h-4" /> Personal mail
        </button>
        <button
          onClick={() => { c.setActiveFolder("archived"); c.setIsComposing(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
            c.activeFolder === "archived" && !c.isComposing
              ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-200"
              : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Archive className="w-4 h-4" /> Archived
        </button>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button
            onClick={() => c.setIsComposing(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 border border-white/10 text-white font-semibold transition-all shadow-lg cursor-pointer"
          >
            <Mail className="w-4 h-4" /> Compose Mail
          </button>
        </div>
      </div>

      {/* Main Mail Area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {c.isComposing ? (
          /* Compose Form Screen */
          <form onSubmit={c.handleSendCompose} className="flex-1 flex flex-col gap-4 bg-white/5 p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-semibold text-white">Compose Work Mail</h3>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-350">Recipient Email</label>
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                value={c.composeTo}
                onChange={(e) => c.setComposeTo(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-350">Subject Header</label>
              <input
                type="text"
                required
                placeholder="Weekly Alignment Review"
                value={c.composeSubject}
                onChange={(e) => c.setComposeSubject(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs text-slate-350">Message Body</label>
              <textarea
                required
                rows={6}
                placeholder="Start typing your email body..."
                value={c.composeBody}
                onChange={(e) => c.setComposeBody(e.target.value)}
                className="flex-1 p-4 rounded-xl bg-black/20 border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 outline-none transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" /> Send Email
            </button>
          </form>
        ) : (
          /* Split View List & Detail */
          <>
            <div className="w-1/2 flex flex-col gap-3 overflow-y-auto pr-2">
              {c.filteredMails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white/5 rounded-3xl border border-white/10">
                  <CheckCircle className="w-8 h-8 opacity-40 mb-2 text-cyan-200" />
                  <span className="text-sm">Inbox cleared! No emails here.</span>
                </div>
              ) : (
                c.filteredMails.map((mail) => (
                  <div
                    key={mail.id}
                    onClick={() => c.handleSelectMail(mail.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      mail.unread
                        ? "bg-white/10 border-cyan-500/30"
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white text-sm">{mail.sender}</span>
                      <span className="text-xs text-white/50">{mail.date}</span>
                    </div>
                    <span className="text-cyan-200 font-medium text-xs">{mail.subject}</span>
                    <p className="text-slate-350 text-[11px] line-clamp-1">{mail.snippet}</p>
                  </div>
                ))
              )}
            </div>

            <div className="w-1/2 bg-white/5 p-6 rounded-3xl border border-white/10 overflow-y-auto flex flex-col gap-4">
              {c.selectedMail ? (
                <>
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <h4 className="font-bold text-white text-base">{c.selectedMail.subject}</h4>
                      <p className="text-xs text-slate-400 mt-1">From: {c.selectedMail.sender}</p>
                    </div>
                    {!c.selectedMail.archived && (
                      <button
                        onClick={() => c.handleArchive(c.selectedMail!.id)}
                        className="p-1 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white transition-all cursor-pointer"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                  <p className="text-slate-200 text-sm whitespace-pre-line leading-relaxed flex-1">
                    {c.selectedMail.body}
                  </p>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <Mail className="w-12 h-12 opacity-30 mb-2" />
                  <span className="text-xs">Select an email to view full content</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MailWorkspace;
