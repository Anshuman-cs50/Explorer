/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppBubble {
  id: string;
  name: string;
  category: "mail" | "media" | "messaging" | "github" | "dashboard" | "notes" | "calendar" | "custom";
  notifications: number;
  color: string;
  textColor: string;
  borderColor: string;
  icon: string;
  children?: { id: string; name: string }[];
  placeholderUrl?: string; // for custom/listed-more apps
  description?: string; // for custom/listed-more apps
  apiKey?: string; // user filled
  apiUrl?: string; // user filled
}

export interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  unread: boolean;
  archived: boolean;
  folder: "work" | "personal";
}

export interface MediaItem {
  id: string;
  name: string;
  type: string; // 'image' | 'video'
  source: "google-photos" | "local";
  url: string;
  size: string;
  group: string;
}

export interface MessageThread {
  channel: "slack" | "whatsapp";
  contact: string;
  avatar: string;
  chats: {
    sender: "me" | string;
    text: string;
    time: string;
  }[];
}

export interface GitIssue {
  id: string;
  title: string;
  author: string;
  status: "open" | "closed";
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export interface GithubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  issues: GitIssue[];
  commits: GitCommit[];
}

export interface DashboardMetric {
  id: string;
  title: string;
  metric: string;
  growth: string;
  chartData: { name: string; value: number }[];
}

export interface WorkspaceNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: string;
  category: "work" | "personal";
}

export interface MockDataPayload {
  apps: AppBubble[];
  availableMoreApps: AppBubble[];
  emails: EmailItem[];
  multimedia: MediaItem[];
  messages: MessageThread[];
  githubRepos: GithubRepo[];
  dashboards: DashboardMetric[];
  notes: WorkspaceNote[];
  calendar: CalendarEvent[];
}
