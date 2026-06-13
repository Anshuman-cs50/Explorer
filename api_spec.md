# Explorer Workspace API Spec

This file documents the API endpoint interfaces, request payloads, and response structures simulated or integrated by the **Explorer** unified workload management cockpit.

---

## 1. Work Mail Proxy API

Supports downloading, composing, and marking mail status headers from unified workspaces.

### GET `/api/v1/mail/inbox`
Retrieves a filtered list of user emails.
* **Headers**: `Authorization: Bearer <API_KEY>`
* **Query Parameters**: `folder = "work" | "personal" | "archived"`
* **Response**:
```json
[
  {
    "id": "mail-1",
    "sender": "John Miller (Hiring)",
    "subject": "Candidate Assessment Review",
    "snippet": "Hello Team, we have reviewed the candidates...",
    "body": "Hello Team,\n\nWe have reviewed...",
    "date": "Jun 12, 11:30 AM",
    "unread": true,
    "archived": false,
    "folder": "work"
  }
]
```

### POST `/api/v1/mail/compose`
Dispatches a newly drafted message block.
* **Payload**:
```json
{
  "sender": "To: HR Colleagues <recruiting@group.com>",
  "subject": "System Alignment Update",
  "body": "Draft updates mapping operational cockpit routes."
}
```

---

## 2. Media Hub (Google Photos & Local Disk Drive)

Connects to cloud directories or mounts and supports transferring media entities between locations.

### POST `/api/v1/media/migrate`
Transfers specified files between active storage locations. High-concurrency operations animate custom progress sliders in the UI.
* **Payload**:
```json
{
  "id": "media-1",
  "targetSource": "google-photos" | "local"
}
```
* **Response**:
```json
{
  "status": "success",
  "migratedItemId": "media-1",
  "origin": "local",
  "destination": "google-photos",
  "bytesTransferred": "2.4 MB"
}
```

---

## 3. Live Chat Integration (Slack & WhatsApp)

Synchronizes conversation threads and generates automatic bot replies to simulate back-and-forth chat.

### POST `/api/v1/messaging/send`
Sends a text block onto message clusters.
* **Payload**:
```json
{
  "channel": "slack" | "whatsapp",
  "contact": "Sarah Connor",
  "text": "Completed workspace deployment tests."
}
```
* **Response (Instant confirmation)**:
```json
{
  "status": "delivered",
  "timestamp": "12:20 PM"
}
```

---

## 4. GitHub API integration

Queries repository metadata and assigns open issue tickets.

### GET `/api/v1/github/repos/:name`
Retrieves status indicators of user registries.
* **Query Parameters**: `tab = "issues" | "commits"`
* **Response (Commits view)**:
```json
{
  "name": "explorer-app",
  "stars": 42,
  "commits": [
    {
      "hash": "e67b2d1",
      "message": "Refactor bubble canvas to support dynamic child hover logic",
      "author": "Anshuman",
      "date": "2 hours ago"
    }
  ]
}
```

---

## 5. Metabase Dashboard Proxy

Proxies analytics databases to load metrics charts on-page.

### GET `/api/v1/metabase/dashboards/:id`
Retrieves timeline values.
* **Query Parameters**: `timeframe = "7d" | "30d" | "all"`
* **Response**:
```json
{
  "id": "dash-1",
  "title": "SaaS Active Users",
  "metric": "42,890",
  "timeframeFactor": 1.25,
  "chartData": [
    {"name": "Mon", "value": 3100},
    {"name": "Tue", "value": 3800}
  ]
}
```
