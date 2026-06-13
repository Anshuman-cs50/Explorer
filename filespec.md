# Explorer Applet Filespec File

This document details the modular directory structure and describes the specific responsibilities of each code unit. It enforces strict separation of display code, data stores, and logical hooks.

## 📂 Core Structure Map

```text
/
├── filespec.json               # JSON index of files
├── filespec.md                 # Markdown index of files (This file)
├── Functionspec.json           # Detailed functional blueprint index
├── api_spec.md                 # API interaction and proxy guidelines
├── package.json                # Project dependencies and script configs
└── src/
    ├── types.ts                # TypeScript common type agreements
    ├── mockData.json           # Central mock data (Mails, Events, Logs)
    ├── App.tsx                 # Main layout coordinator
    ├── index.css               # Google fonts configurations
    ├── main.tsx                # Applet rendering bootstrap
    ├── logic/                  # Business logic & State layers (.ts)
    │   ├── explorerStore.ts    # Central OOP Reactive Store
    │   ├── mailLogic.ts        # Mail folder controllers
    │   ├── mediaLogic.ts       # Cloud and local source controllers
    │   ├── messagingLogic.ts   # WhatsApp/Slack message coordinators
    │   ├── githubLogic.ts      # Active repository controllers
    │   ├── dashboardLogic.ts   # Metabase analytics state filters
    │   ├── notesLogic.ts       # Text editor states & autosaves
    │   └── calendarLogic.ts    # Event logs and date navigators
    └── components/             # Pure presentational displays (.tsx)
        ├── BubbleCanvas.tsx    # Responsive floating constellations
        ├── GlassModal.tsx      # Frosted overlay glass window components
        ├── MailWorkspace.tsx   # Mail sidebar list panes
        ├── MediaWorkspace.tsx  # Dynamic bento gallery boards
        ├── MessagingWorkspace.tsx # Message bubble timelines
        ├── GithubWorkspace.tsx # profile summaries and commit feeds
        ├── DashboardWorkspace.tsx # Metabase line-chart layers
        ├── NotesWorkspace.tsx  # Notepad list editors
        ├── CalendarWorkspace.tsx # Grids and day schedules
        └── AddAppWorkspace.tsx # Credential input templates
```

## 🛠️ Design Architecture Overview

1. **State Isolation**: Components (`/src/components/*`) are entirely stateless or contain only transient layout indicators. They read state and commit modifications using functional controllers (`/src/logic/*`) connected to the central Object-Oriented `ExplorerStore`.
2. **Persistence**: The OOP Store initializes using `/src/mockData.json` on cold boot, caches updates to `localStorage` on any model edit event, and notifies UI subscribers.
3. **Typography & Styling**: Leverages custom display pairings ("Space Grotesk" display text and "JetBrains Mono" status headers) configured within Tailwind's theme rules inside `src/index.css`.
