# TaskPilot MVP Design Document

## 1. Competitive Analysis

### Tools Analyzed
| Tool | Core Strength | Standout UI/UX Pattern | Weakness |
|------|--------------|------------------------|----------|
| **Zoho Projects** | Full-featured PPM with Phases, Issues, Time Logs | Dashboard widgets + left-nav tree for Reports | Heavy, slow; too many empty states |
| **Asana** | Flexible task views (List / Board / Calendar / Timeline) | "My Tasks" as the daily home screen; clean assignee chips | Expensive; can feel cluttered at scale |
| **Trello** | Visual Kanban simplicity | Card-based drag-and-drop; Power-Ups | No native sub-tasks or reporting on free plan |
| **Basecamp** | Opinionated simplicity (Projects = containers) | Hill Charts; single-message-thread per to-do | Lacks structured task hierarchy |
| **Jira** | Agile/Scrum for dev teams | Backlog → Sprint → Board workflow; issue linking | Steep learning curve; overkill for non-dev teams |
| **Monday.com** | Colorful visual boards | Column formulas + multiple views | Expensive; noisy UI |
| **ClickUp** | Customizable "everything" app | 13+ views; Docs + Chat inside tasks | Overwhelming onboarding |

### Key UX Insights from Research
1. **"My Tasks" is the #1 daily entry point** — Asana, Basecamp, and Zoho all surface a personalized "what's on my plate today" view.
2. **Projects are containers, not just metadata** — Tasks/Issues/Files/Time-Logs must live *inside* a project context (Zoho, Basecamp, Jira).
3. **Kanban is non-negotiable** — Every modern PM app offers a board view; list-only is insufficient.
4. **Time tracking must be lightweight** — ClickUp and Zoho embed a timer inside the task; heavy timesheets kill adoption.
5. **Empty states should guide action** — Zoho’s empty-state illustrations are good, but they lack a CTA ("Add your first task").
6. **Reports must be one-click** — Pre-built charts (Status by Project, Tasks by Owner) generate value immediately; custom report builders are post-MVP.
7. **Activity feed builds trust** — Teams need to see *who did what when* to replace hallway conversations.

---

## 2. What Is Missing in Current TaskPilot

### Current Pages vs. Reference (Zoho)

| Zoho Screen | Current TaskPilot | Gap |
|-------------|-------------------|-----|
| **Home / Dashboard** | Dashboard.jsx with hard-coded stats | No real data binding; missing "My Issues", "Overdue", "My Phases" widgets |
| **Projects List** | Projects.jsx card grid | No **Project Detail** page; no table view; no custom fields (Client Type, SOW, Payment Status) |
| **Tasks** | Tasks.jsx table | No **Kanban view**; no sub-tasks / task lists; no inline-add; no grouping by Task List |
| **Issues** | ❌ Missing entirely | No bug/issue tracking |
| **Phases** | ❌ Missing entirely | No milestone/phase management |
| **Time Logs** | ❌ Missing entirely | No time tracking |
| **Reports** | ❌ Missing entirely | No charts or pre-built reports |
| **Collaboration** | ❌ Missing entirely | No activity feed, comments, or @mentions |
| **Calendar** | Calendar.jsx static month | Not connected to real task/issue due dates |
| **Team** | Team.jsx table | No roles/permissions; no project-specific team assignment |
| **Settings** | Settings.jsx placeholders | Not functional |

### Missing Core Behaviors
1. **State management** — Everything is static arrays; no `useState`, no create/update/delete.
2. **Search** — Search bar in header is decorative.
3. **Notifications** — Bell icon has no dropdown.
4. **Filtering & Sorting** — Tasks page has Filter/Sort buttons that do nothing.
5. **View toggles** — List / Board / Calendar toggles missing.
6. **Project context** — Tasks exist in a flat table; they should be scoped to a project.
7. **Task detail drawer / modal** — No way to edit a task’s description, comments, or subtasks.

---

## 3. Information Architecture (IA)

```
TaskPilot
├── Home (Dashboard)
│   ├── Global Stats Row
│   ├── My Tasks
│   ├── My Issues
│   ├── My Overdue Work Items
│   ├── My Time Logs (weekly summary)
│   └── Activity Stream
├── Projects
│   ├── List View / Card View toggle
│   └── Project Detail (/projects/:id)
│       ├── Overview (progress, dates, team, description)
│       ├── Tasks (List + Kanban toggle)
│       ├── Issues (List)
│       ├── Phases (List / Gantt-lite)
│       ├── Files
│       ├── Time Logs
│       └── Activity
├── Tasks
│   ├── All Tasks (List / Kanban toggle)
│   ├── My Tasks
│   └── Group By: Project | Task List | Assignee | Priority
├── Issues
│   ├── All Issues
│   └── Submit Issue
├── Phases
│   └── All Phases (grouped by Project)
├── Time Logs
│   ├── My Time Logs (weekly)
│   └── Add Time Log
├── Reports
│   ├── Project Status (bar chart)
│   ├── Task Status (bar/pie)
│   └── Issue Status (bar/pie)
├── Team
│   └── Members + Roles
└── Settings
    ├── Profile
    ├── Notifications
    └── Appearance
```

---

## 4. MVP Feature Definition

### Must-Have (P0) — Core Loop
These features make the app a *usable* project management tool.

| # | Feature | User Story | UI Pattern |
|---|---------|------------|------------|
| 1 | **Project CRUD** | As a PM, I can create a project, set dates, assign a team, and track % completion so that work is organized into containers. | Card grid + Detail page with tabs |
| 2 | **Task CRUD (within Project)** | As a team member, I can create tasks, set due dates, assign owners, set priority/status, and add tags so that everyone knows what to do. | List table + Kanban board + Inline add row |
| 3 | **Kanban Board** | As a team member, I can move tasks across columns (To Do → In Progress → Done) so that status is visual. | 3-column board; click or drag to change status |
| 4 | **Issue Tracking** | As a QA/dev, I can submit issues with severity/status/assignee so that bugs are tracked separately from tasks. | Table view similar to Tasks; "Submit Issue" primary CTA |
| 5 | **Phases / Milestones** | As a PM, I can break a project into phases with start/end dates so that large projects are staged. | Table with progress bar per phase |
| 6 | **Time Logging** | As a contributor, I can log hours against a task/project with notes so that effort is recorded. | Weekly table; inline "Add Time Log" row |
| 7 | **Dashboard** | As any user, I see my personalized dashboard with real counts and overdue items so that I know where to focus. | Widget grid; real data from local state |
| 8 | **Activity Feed** | As any user, I can see a chronological feed of who created/updated what so that context is never lost. | Simple text list with avatar + timestamp |
| 9 | **Pre-built Reports** | As a PM, I can view 3 status charts (Project, Task, Issue) so that I can report upward without Excel. | Bar charts using `--semantic-primary` |
| 10 | **Functional Search** | As any user, I can search across projects, tasks, and issues so that I find work quickly. | Global header search with results dropdown |
| 11 | **Notifications** | As any user, I receive in-app notifications when assigned to a task or mentioned so that I don't miss updates. | Bell dropdown with unread indicator |
| 12 | **Team & Roles** | As an admin, I can invite members and assign roles (Admin / Manager / Member) so that access is controlled. | Table with role badges |

### Should-Have (P1) — Polish
| # | Feature | Reason |
|---|---------|--------|
| 13 | **Task Detail Drawer** | View/edit description, comments, subtasks, time logs in a side drawer instead of navigating away. |
| 14 | **Calendar with Real Data** | Surface task/issue due dates on the calendar. |
| 15 | **File Attachments (Mock)** | Show attachment UI; no real upload backend needed for MVP. |
| 16 | **Dark Mode Toggle** | myOperator design system supports dark variables; easy win. |

### Won’t-Have (Post-MVP)
- Gantt charts with dependencies
- Real-time collaborative cursors
- Email/SMS notifications
- API / Webhooks
- Custom fields
- Automations / Workflows
- Resource workload view
- Budget / Cost tracking
- Client portal

---

## 5. User Flows

### Flow A: Daily Standup (Contributor)
```
Open App → Dashboard
  → View "My Tasks" widget
  → Click task → Update status to "In Progress"
  → Log 2 hours in "My Time Logs"
  → Check "Issues Due Today" widget
  → Done
```

### Flow B: Sprint Planning (PM)
```
Open App → Projects
  → Open "Product Design" project
  → Switch to Phases tab → Add Phase "Discovery"
  → Switch to Tasks tab → Add tasks under "Discovery"
  → Assign owners & set due dates
  → Switch to Kanban view → Verify columns
  → Done
```

### Flow C: Bug Triage (QA)
```
Open App → Issues
  → Click "Submit Issue"
  → Fill: Issue Name, Project, Assignee, Severity=High
  → Save
  → Activity feed auto-updates
  → Assignee receives notification
```

### Flow D: Weekly Review (Manager)
```
Open App → Reports
  → View "Project Status" chart
  → View "Task Status by Owner" chart
  → Click into overdue project
  → Send reminder comments on blocked tasks
  → Done
```

---

## 6. Design Decisions

### Navigation Structure
- **Primary nav** (sidebar): Home, Projects, Tasks, Issues, Phases, Time Logs, Reports, Team, Calendar, Settings
- **Project-level nav** (tabs inside Project Detail): Overview, Tasks, Issues, Phases, Files, Time Logs, Activity
- **View toggles** (secondary toolbar): List / Kanban / Calendar

### Color & Typography
- Follow **myOperator design system** strictly:
  - Font: Source Sans Pro (400/600/700)
  - Primary: `#343E55` (`--semantic-primary`)
  - Accent (interactive only): `#2BBCCA` (`--semantic-brand`)
  - Success/Warning/Error tokens for status badges
  - `rounded` (4px) for buttons/inputs, `rounded-lg` (8px) for cards
  - `z-[9999]` for any modals/drawers

### Component Patterns
- **Tables**: Rounded border container, gray header row, hover highlight
- **Badges**: Rounded-full pills for status (Active, In Progress, Completed, High/Medium/Low)
- **Progress bars**: Thin bars inside table cells and project cards
- **Empty states**: Centered illustration area + headline + CTA button (no dead-ends)
- **Inline add rows**: Last row of every table is a placeholder input row (like Zoho)

### Responsive Strategy
- Sidebar collapses to hamburger on < 1024px
- Tables become horizontally scrollable
- Kanban stacks vertically on mobile
- Dashboard widgets go 1-column on mobile

---

## 7. Data Model (Frontend State)

```typescript
// Suggested shape for useState / Context
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number; // 0-100
  ownerId: string;
  startDate?: string;
  endDate?: string;
  teamMemberIds: string[];
}

interface Task {
  id: string;
  projectId: string;
  taskListId?: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  duration?: number; // days
  completionPercent: number;
  tags: string[];
  timelogTotal?: number; // hours
}

interface Issue {
  id: string;
  projectId: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  assigneeId?: string;
  reporterId: string;
  dueDate?: string;
  createdAt: string;
}

interface Phase {
  id: string;
  projectId: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  ownerId?: string;
  startDate?: string;
  endDate?: string;
  progress: number;
}

interface TimeLog {
  id: string;
  projectId: string;
  taskId?: string;
  userId: string;
  title: string;
  dailyLogHours: number;
  date: string; // ISO date
  billingType?: 'Billable' | 'Non-Billable';
  notes?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Member';
  avatar?: string;
  status: 'Active' | 'Away';
}

interface Activity {
  id: string;
  userId: string;
  action: string;
  targetType: 'Project' | 'Task' | 'Issue' | 'Phase' | 'TimeLog';
  targetId: string;
  targetName: string;
  timestamp: string;
}

interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
```

---

## 8. Implementation Roadmap

### Phase 1 — Foundation (1-2 days)
1. Update `App.jsx` router with new routes (`/issues`, `/phases`, `/timelogs`, `/reports`, `/projects/:id`)
2. Update `MainLayout.jsx` sidebar nav to match IA; add functional search + notification dropdown
3. Create a `DataContext` (React Context) with demo data and CRUD helpers so all pages share live state

### Phase 2 — Core Pages (2-3 days)
4. Rebuild **Dashboard** with real data widgets (My Tasks, My Issues, Overdue, Activity)
5. Rebuild **Projects** with list/card toggle + **Project Detail** tabbed layout
6. Rebuild **Tasks** with List + Kanban toggle, inline add, grouping
7. Build **Issues** page (table + submit form)
8. Build **Phases** page (table + inline add)
9. Build **Time Logs** page (weekly view + inline add)

### Phase 3 — Insights & Collaboration (1-2 days)
10. Build **Reports** page with 3 bar charts (Project Status, Task Status, Issue Status)
11. Build **Team** page with invite modal and role editing
12. Build **Activity Feed** component reused in Dashboard + Project Detail
13. Build **Notification** system (dropdown + badge)

### Phase 4 — Polish (1 day)
14. Wire **Calendar** to real task/issue due dates
15. Add **Task Detail Drawer** (side panel for comments, subtasks, time)
16. Ensure all pages use myOperator CSS tokens (no hardcoded hex)
17. Responsive pass on tables and Kanban

---

## 9. Success Criteria for MVP

A user should be able to complete these end-to-end scenarios without hitting a dead-end or static placeholder:

- [ ] Create a project, add 3 tasks, assign them to team members, and see the Dashboard update.
- [ ] Switch a task from "To Do" to "In Progress" on the Kanban board and see the Project progress bar increase.
- [ ] Submit an issue, assign it, and find it in the Issues list with correct severity badge.
- [ ] Log time against a task and see it reflected in the Time Logs page.
- [ ] Open Reports and see a bar chart that reflects the current project/task/issue counts.
- [ ] Use the global search to find a task by name and navigate to it.
- [ ] Receive a notification when assigned to a new task.

---

*Document version: 1.0*  
*Reference apps: Zoho Projects, Asana, Basecamp, Trello, Jira*  
*Design system: myOperator*
