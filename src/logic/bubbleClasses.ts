/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Child bubble custom metadata mapping
const CHILD_METADATA_MAP: Record<string, { icon: string; color: string; borderColor: string }> = {
  mail_inbox: { icon: "Inbox", color: "from-blue-500/20 to-cyan-500/10", borderColor: "border-blue-500/30" },
  mail_personal: { icon: "User", color: "from-cyan-500/20 to-teal-500/10", borderColor: "border-cyan-500/30" },
  media_cloud: { icon: "Cloud", color: "from-purple-500/20 to-pink-500/10", borderColor: "border-purple-500/30" },
  media_local: { icon: "HardDrive", color: "from-pink-500/20 to-rose-500/10", borderColor: "border-pink-500/30" },
  msg_slack: { icon: "MessageCircle", color: "from-green-500/20 to-emerald-500/10", borderColor: "border-green-500/30" },
  msg_whatsapp: { icon: "Phone", color: "from-emerald-500/20 to-teal-500/10", borderColor: "border-emerald-500/30" },
  git_repos: { icon: "FolderGit", color: "from-indigo-500/20 to-violet-500/10", borderColor: "border-indigo-500/30" },
  git_issues: { icon: "AlertCircle", color: "from-violet-500/20 to-fuchsia-500/10", borderColor: "border-violet-500/30" },
  dash_saas: { icon: "TrendingUp", color: "from-amber-500/20 to-orange-500/10", borderColor: "border-amber-500/30" },
  dash_finance: { icon: "DollarSign", color: "from-orange-500/20 to-red-500/10", borderColor: "border-orange-500/30" },
  note_scratch: { icon: "PenTool", color: "from-teal-500/20 to-emerald-500/10", borderColor: "border-teal-500/30" },
  note_todo: { icon: "CheckSquare", color: "from-emerald-500/20 to-green-500/10", borderColor: "border-emerald-500/30" },
  cal_week: { icon: "Clock", color: "from-rose-500/20 to-red-500/10", borderColor: "border-rose-500/30" },
  cal_reminders: { icon: "Bell", color: "from-red-500/20 to-orange-500/10", borderColor: "border-red-500/30" },
};

export class BaseBubble {
  id: string;
  name: string; // Will store lowercased name format
  category: string;
  notifications: number;
  color: string;
  textColor: string;
  borderColor: string;
  icon: string;

  constructor(config: {
    id: string;
    name: string;
    category: string;
    notifications?: number;
    color?: string;
    textColor?: string;
    borderColor?: string;
    icon?: string;
  }) {
    this.id = config.id;
    this.name = config.name.toLowerCase(); // Lowercase naming convention requirement 3
    this.category = config.category;
    this.notifications = config.notifications || 0;
    this.color = config.color || "from-slate-500/20 to-slate-600/20";
    this.textColor = config.textColor || "text-slate-200";
    this.borderColor = config.borderColor || "border-slate-500/30";
    this.icon = config.icon || "HelpCircle";
  }

  // Sizing behavior available to all bubble instances
  getVolumeSize(baseSize = 60, scale = 10, volumetricActive = true): number {
    if (!volumetricActive || this.notifications <= 0) return baseSize;
    return baseSize + scale * Math.log1p(this.notifications) * Math.exp(1 / (this.notifications + 1.2));
  }

  hasNotifications(): boolean {
    return this.notifications > 0;
  }

  isParent(): boolean {
    return false;
  }
}

// Child class inheriting BaseBubble with custom modifications
export class WorkspaceBubble extends BaseBubble {
  childBubbles: ChildSatelliteBubble[] = [];

  constructor(config: {
    id: string;
    name: string;
    category: string;
    notifications?: number;
    color?: string;
    textColor?: string;
    borderColor?: string;
    icon?: string;
    children?: { id: string; name: string }[];
  }) {
    super(config);
    // Initialize childBubbles in strict OOP way
    if (config.children) {
      this.childBubbles = config.children.map((child) => {
        const metadata = CHILD_METADATA_MAP[child.id] || {
          icon: config.icon || "HelpCircle",
          color: config.color || "from-slate-500/20 to-slate-600/20",
          borderColor: config.borderColor || "border-slate-500/30",
        };
        return new ChildSatelliteBubble({
          id: child.id,
          name: child.name,
          category: config.category,
          icon: metadata.icon,
          color: metadata.color,
          textColor: config.textColor || "text-slate-200",
          borderColor: metadata.borderColor,
          notifications: 0,
        });
      });
    }
  }

  override isParent(): boolean {
    return true;
  }

  // Parenting modification: dynamic resizing is slightly amplified for workspace central anchors
  override getVolumeSize(baseSize = 60, scale = 11, volumetricActive = true): number {
    return super.getVolumeSize(baseSize, scale, volumetricActive);
  }
}

// Child class specifically representing satellite level bubbles
export class ChildSatelliteBubble extends BaseBubble {
  constructor(config: {
    id: string;
    name: string;
    category: string;
    icon: string;
    color: string;
    textColor: string;
    borderColor: string;
    notifications?: number;
  }) {
    super(config);
  }

  // Modification for child/satellite bubble sizing (compact and cute) - reduced by 25%
  override getVolumeSize(): number {
    return 42; // Standard reduced round size for a satellite bubble
  }
}
