/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MockDataPayload, AppBubble, EmailItem, MediaItem, MessageThread, WorkspaceNote, CalendarEvent } from "../types";
import initialMockData from "../mockData.json";

export class ExplorerStore {
  private state: MockDataPayload;
  private listeners: Set<() => void> = new Set();

  constructor() {
    const saved = localStorage.getItem("explorer_state");
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        this.state = initialMockData as unknown as MockDataPayload;
      }
    } else {
      this.state = initialMockData as unknown as MockDataPayload;
    }
  }

  private save(): void {
    localStorage.setItem("explorer_state", JSON.stringify(this.state));
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // State Getters
  public getState(): MockDataPayload {
    return this.state;
  }

  // Volumetric bubble sizing calculations (Log-Exponential)
  // Normalizes bubble size given different notification counts.
  public getBubbleVolumeSize(notifications: number, baseSize = 80, scale = 14): number {
    if (notifications <= 0) return baseSize;
    // Log exponential: baseSize + scale * Math.log1p(notifications) * Math.exp(1 / (notifications + 1))
    return baseSize + scale * Math.log1p(notifications) * Math.exp(1 / (notifications + 1.2));
  }

  // App Level Operations
  public addCustomApp(app: AppBubble): void {
    // Add custom api credentials
    const exists = this.state.apps.find((a) => a.id === app.id);
    if (!exists) {
      this.state.apps.push(app);
      this.save();
    }
  }

  // Mail Operations
  public sendMail(sender: string, subject: string, body: string, folder: "work" | "personal"): void {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMail: EmailItem = {
      id: `mail-${Date.now()}`,
      sender,
      subject,
      snippet: body.substring(0, 60) + (body.length > 60 ? "..." : ""),
      body,
      date: `Today, ${timeStr}`,
      unread: false,
      archived: false,
      folder,
    };
    this.state.emails.unshift(newMail);
    
    // Increment notifications for the mail app bubble
    const mailBubble = this.state.apps.find((a) => a.id === "mail");
    if (mailBubble) mailBubble.notifications += 1;

    this.save();
  }

  public markMailAsRead(id: string): void {
    const email = this.state.emails.find((e) => e.id === id);
    if (email && email.unread) {
      email.unread = false;
      const mailBubble = this.state.apps.find((a) => a.id === "mail");
      if (mailBubble && mailBubble.notifications > 0) {
        mailBubble.notifications = Math.max(0, mailBubble.notifications - 1);
      }
      this.save();
    }
  }

  public archiveMail(id: string): void {
    const email = this.state.emails.find((e) => e.id === id);
    if (email) {
      email.archived = true;
      this.save();
    }
  }

  // Media Operations
  public deleteMediaItem(id: string): void {
    this.state.multimedia = this.state.multimedia.filter((m) => m.id !== id);
    this.save();
  }

  public migrateMediaSource(id: string, targetSource: "google-photos" | "local"): void {
    const item = this.state.multimedia.find((m) => m.id === id);
    if (item) {
      item.source = targetSource;
      this.save();
    }
  }

  public setMediaGroup(id: string, group: string): void {
    const item = this.state.multimedia.find((m) => m.id === id);
    if (item) {
      item.group = group;
      this.save();
    }
  }

  // Messages Operations
  public sendChat(channel: "slack" | "whatsapp", contact: string, text: string): void {
    const thread = this.state.messages.find(
      (m) => m.channel === channel && m.contact === contact
    );
    if (thread) {
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      thread.chats.push({
        sender: "me",
        text,
        time: timeStr,
      });
      this.save();
    }
  }

  // Notes Operations
  public addNote(title: string, content: string): void {
    const newNote: WorkspaceNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      updatedAt: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    };
    this.state.notes.unshift(newNote);
    this.save();
  }

  public updateNote(id: string, title: string, content: string): void {
    const note = this.state.notes.find((n) => n.id === id);
    if (note) {
      note.title = title;
      note.content = content;
      note.updatedAt = `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      this.save();
    }
  }

  public deleteNote(id: string): void {
    this.state.notes = this.state.notes.filter((n) => n.id !== id);
    this.save();
  }

  // Calendar Operations
  public addCalendarEvent(event: Omit<CalendarEvent, "id">): void {
    const newEvent: CalendarEvent = {
      ...event,
      id: `cal-${Date.now()}`,
    };
    this.state.calendar.push(newEvent);
    this.save();
  }
}

// Single active instance
export const store = new ExplorerStore();
export default store;
