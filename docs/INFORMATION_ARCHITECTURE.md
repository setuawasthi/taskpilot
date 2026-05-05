# TaskPilot Information Architecture v2.0

> Updated IA incorporating competitive analysis insights from Monday.com, ClickUp, Trello, and Jira.
> Date: Apr 29, 2026

---

## 1. Information Architecture Diagram

```
TaskPilot
│
├── 🏠 My Work (NEW — Personalized Home)
│   ├── Today's Focus
│   │   ├── Assigned tasks due today
│   │   └── Overdue items
│   ├── Upcoming This Week
│   │   ├── Tasks with due dates
│   │   └── Issue deadlines
│   ├── Recent Activity
│   │   ├── Comments on my tasks
│   │   └── Status changes
│   └── Quick Stats
│       ├── Open tasks assigned to me
│       ├── Overdue count
│       └── Hours logged this week
│
├── 📊 Dashboard
│   ├── Global Stats Row
│   │   ├── Open Tasks (all)
│   │   ├── Completed Tasks
│   │   ├── Overdue Tasks
│   │   ├── Open Issues
│   │   └── Hours Logged (my week)
│   ├── Tasks Widget
│   │   ├── Overdue tasks
│   │   ├── Upcoming tasks
│   │   └── Recently completed
│   ├── Issues Widget
│   │   └── Open issues by severity
│   ├── Activity Feed
│   │   └── Global activity stream
│   └── Quick Links
│       ├── Projects
│       ├── Calendar
│       └── My Work
│
├── 📁 Projects
│   ├── Projects List
│   │   ├── Grid View (cards)
│   │   └── List View (table)
│   └── Project Detail (/projects/:id)
│       ├── Overview Tab
│       │   ├── Project header + status
│       │   ├── Stats cards (progress, tasks, issues, hours)
│       │   ├── Details (owner, dates, description)
│       │   └── Team members
│       ├── Tasks Tab
│       │   ├── List view (table)
│       │   └── Kanban view (board)
│       ├── Issues Tab
│       │   └── Issue table
│       ├── Phases Tab
│       │   └── Phase table
│       ├── Time Logs Tab
│       │   └── Logged hours table
│       └── Activity Tab
│           └── Project-specific activity
│
├── ✅ Tasks
│   ├── All Tasks
│   │   ├── List View
│   │   │   ├── Inline status editing
│   │   │   ├── Inline priority editing
│   │   │   ├── Bulk actions (NEW)
│   │   │   └── Inline title editing (NEW)
│   │   └── Kanban View
│   │       ├── Clickable cards
│   │       ├── Status move arrows
│   │       └── Quick status change
│   ├── Filters & Grouping
│   │   ├── By Project
│   │   ├── By Assignee
│   │   ├── By Priority
│   │   └── By Status
│   └── Task Detail (/tasks/:id)
│       ├── Header (title, status, priority, tags)
│       ├── Description
│       ├── Subtasks / Checklist
│       ├── Dependencies (NEW)
│       │   ├── "Depends on" tasks
│       │   └── "Blocking" tasks
│       ├── Comments
│       ├── Activity History
│       ├── Metadata Sidebar
│       │   ├── Project link
│       │   ├── Assignee
│       │   ├── Due date
│       │   ├── Priority
│       │   ├── Progress bar
│       │   ├── Time logged
│       │   └── Tags
│       ├── Time Logs
│       └── Actions (NEW)
│           ├── Duplicate task
│           └── Delete task
│
├── 🐛 Issues
│   ├── Issues List
│   │   ├── Filter by project
│   │   ├── Filter by severity
│   │   └── Search
│   ├── Issue Detail (inline in table)
│   └── Submit Issue (modal)
│
├── 🗓 Calendar
│   ├── Monthly View
│   │   ├── Task due dates
│   │   ├── Issue due dates
│   │   └── Click to navigate (NEW)
│   └── Navigation
│       ├── Previous / Next month
│       └── Today button
│
├── 📅 Phases
│   ├── Phases List
│   │   ├── Filter by project
│   │   └── Search
│   └── Phase Detail
│       ├── Progress tracking
│       └── Owner assignment
│
├── ⏱ Time Logs
│   ├── Weekly View
│   │   ├── Filter by user
│   │   └── Week navigation
│   └── Add Time Log (modal)
│       ├── Project selector
│       ├── Task selector
│       ├── Hours
│       ├── Date
│       ├── Billing type
│       └── Notes
│
├── 📈 Reports
│   ├── Global Stats
│   ├── Project Status Chart
│   ├── Task Status Chart
│   ├── Issue Status Chart
│   └── Tasks by Assignee Chart
│
├── 👥 Team
│   ├── Members List
│   │   ├── Search
│   │   └── Role badges
│   ├── Invite Member (modal)
│   └── Role Management
│       ├── Admin
│       ├── Manager
│       └── Member
│
├── ⚙️ Settings
│   ├── Profile
│   │   ├── Name
│   │   ├── Email
│   │   └── Avatar
│   ├── Notifications
│   │   ├── Email notifications
│   │   ├── Push notifications
│   │   ├── Mentions
│   │   └── Deadline reminders
│   ├── Security
│   │   ├── Change password
│   │   └── Two-factor auth (mock)
│   └── Appearance
│       └── Dark mode toggle
│
└── 🔍 Command Palette (NEW — Cmd+K)
    ├── Search Projects
    ├── Search Tasks
    ├── Search Issues
    ├── Quick Navigation
    │   ├── Go to My Work
    │   ├── Go to Tasks
    │   ├── Go to Projects
    │   └── Go to Issues
    └── Recent Items
```

---

## 2. Navigation Structure

### 2.1 Primary Navigation (Sidebar)

```
Home
  └── My Work (NEW) — personalized dashboard

Workspace
  ├── Projects
  ├── Tasks
  ├── Issues
  └── Phases

Insights
  ├── Time Logs
  ├── Reports
  └── Calendar

Admin
  ├── Team
  └── Settings
```

### 2.2 Secondary Navigation (Page-level)

**Projects:**
- View toggle: Grid / List
- Search
- Filter: Status
- Sort: Name, Date, Progress
- Action: New Project

**Tasks:**
- View toggle: List / Kanban
- Filter: Project, Status
- Group By: None, Project, Assignee, Priority
- Search (via Command Palette)
- Action: New Task
- Bulk Actions (NEW): Change status, assignee, delete

**Issues:**
- Filter: Project, Severity
- Search
- Action: Submit Issue

**Calendar:**
- Month navigator
- Today button
- Click event → Task/Issue detail (NEW)

---

## 3. Data Model

### 3.1 Core Entities

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number; // 0-100
  ownerId: string;
  startDate?: string; // ISO date
  endDate?: string;   // ISO date
  teamMemberIds: string[];
}

interface Task {
  id: string;
  projectId: string;
  taskListId?: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId?: string;
  dueDate?: string;   // ISO date
  startDate?: string; // ISO date
  duration?: number;  // days
  completionPercent: number; // 0-100
  tags: string[];
  timelogTotal?: number; // hours
  dependencies?: string[]; // taskIds this task depends on (NEW)
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
  progress: number; // 0-100
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

interface Subtask {
  id: string;
  taskId: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  assigneeId?: string;
}

interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

interface Activity {
  id: string;
  userId: string;
  action: string;
  targetType: 'Project' | 'Task' | 'Issue' | 'Phase' | 'TimeLog' | 'Subtask' | 'Comment';
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

### 3.2 Relationships

```
Project 1:N Task
Project 1:N Issue
Project 1:N Phase
Project 1:N TimeLog
Project N:M User (team members)

Task N:1 Project
Task N:1 User (assignee)
Task 1:N Subtask
Task 1:N TaskComment
Task 1:N TimeLog
Task N:N Task (dependencies) (NEW)

Issue N:1 Project
Issue N:1 User (assignee)
Issue N:1 User (reporter)

Phase N:1 Project
Phase N:1 User (owner)

TimeLog N:1 Project
TimeLog N:1 Task (optional)
TimeLog N:1 User

Activity N:1 User
Notification N:1 User
```

---

## 4. User Flows

### 4.1 Daily Standup (Contributor)
```
Open App → My Work (default landing)
  → View "Today's Focus" widget
    → See assigned tasks due today
    → See overdue items
  → Click task → Task Detail
    → Update status to "In Progress"
    → Add comment with update
    → Log time
  → Check "Upcoming This Week"
    → Review tasks for next 7 days
  → Done
```

### 4.2 Sprint Planning (PM)
```
Open App → Projects
  → Open "Product Design" project
  → Switch to Phases tab → Add Phase "Discovery"
  → Switch to Tasks tab → Add tasks
    → Assign owners & set due dates
    → Set dependencies (NEW)
  → Switch to Kanban view → Verify columns
  → Done
```

### 4.3 Task Triage (Team Lead)
```
Open App → Tasks (List View)
  → Filter by "In Progress"
  → Select multiple tasks (NEW — bulk actions)
    → Bulk change status to "Done"
    → Bulk assign to team member
  → Or use Command Palette (Cmd+K)
    → Search task by name
    → Navigate directly
  → Done
```

### 4.4 Bug Triage (QA)
```
Open App → Issues
  → Click "Submit Issue"
  → Fill: Issue Name, Project, Assignee, Severity=High
  → Save
  → Activity feed auto-updates
  → Assignee receives notification
  → Done
```

### 4.5 Weekly Review (Manager)
```
Open App → Reports
  → View "Project Status" chart
  → View "Task Status by Owner" chart
  → Click into overdue project
  → Send reminder comments on blocked tasks
  → Done
```

### 4.6 Calendar Review (PM)
```
Open App → Calendar
  → Navigate to next month
  → Click task event on due date (NEW)
    → Navigate to Task Detail
  → Click issue event
    → Navigate to Issues page
  → Done
```

---

## 5. Page Specifications

### 5.1 My Work (NEW)
**Purpose:** Personalized daily dashboard — the "what's on my plate" view.

**Layout:**
- Full-width page
- 3-column grid on desktop, 1-column on mobile
- Left column: Today's Focus + Upcoming
- Middle column: Assigned Tasks (list)
- Right column: Quick Stats + Recent Activity

**Widgets:**
1. **Today's Focus**
   - Tasks assigned to currentUser due today
   - Overdue tasks (highlighted in red)
   - Issues assigned to currentUser due today

2. **Upcoming This Week**
   - Tasks due in next 7 days
   - Sorted by due date

3. **My Tasks**
   - All tasks assigned to currentUser
   - Group by status
   - Inline status change

4. **Quick Stats**
   - Open tasks assigned to me
   - Overdue count
   - Hours logged this week
   - Completed this week

5. **Recent Activity**
   - Recent comments on my tasks
   - Status changes on my tasks
   - New assignments

**Actions:**
- Quick add task
- Navigate to task detail
- Mark task complete

### 5.2 Tasks (Enhanced)
**Purpose:** Central task management with multiple views and bulk actions.

**Enhancements:**
- Bulk action bar (appears when items selected)
- Inline title editing (click to edit)
- Task dependencies badge
- Dependency filter

**Bulk Actions:**
- Change status
- Change assignee
- Change priority
- Delete

### 5.3 Task Detail (Enhanced)
**Purpose:** Rich task view with full context.

**Enhancements:**
- Dependencies section
  - "Depends on" — tasks this task is blocked by
  - "Blocking" — tasks blocked by this task
  - Add dependency search
- Duplicate task action
- Archive task action

### 5.4 Calendar (Enhanced)
**Purpose:** Visual timeline of deadlines.

**Enhancements:**
- Click event → navigate to detail
- Hover tooltip with full info
- Today button
- Different colors for tasks vs issues

---

## 6. Design System Application

### 6.1 Color Usage

| Element | Color Token | Usage |
|---------|-------------|-------|
| Primary brand | `#6366F1` | Buttons, active nav, links, focus rings |
| Success | `#2F9E58` | Done status, completed progress |
| Warning | `#E5A117` | Medium priority, On Hold status |
| Error | `#E64646` | Overdue, Critical severity, High priority |
| Info | `#6366F1` | In Progress, Active status |
| Surface | `#F7F8FA` | Page background |
| Card | `#FFFFFF` | Content cards |
| Border | `#E8EAED` | Dividers, table borders |

### 6.2 Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | 17px | 600 | `#1D2129` |
| Section title | 15px | 600 | `#1D2129` |
| Card title | 13px | 600 | `#1D2129` |
| Body text | 13px | 400 | `#5E6878` |
| Meta text | 11px | 400 | `#919BA8` |
| Badge text | 10-11px | 500 | varies |

### 6.3 Spacing

| Element | Padding | Margin |
|---------|---------|--------|
| Page | 20px (px-5) | — |
| Card | 16px (p-4) | — |
| Card header | 12px 16px | — |
| Table row | 14px 20px | — |
| Button | 6px 12px | — |
| Input | 6px 12px | — |

### 6.4 Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 4px (rounded) |
| Inputs | 4px (rounded) |
| Cards | 8px (rounded-lg) |
| Badges | 9999px (rounded-full) |
| Modals | 8px (rounded-lg) |
| Avatars | 9999px (rounded-full) |

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Single column, hamburger nav, stacked Kanban |
| Tablet | 768px - 1024px | 2-column grid, collapsible sidebar |
| Desktop | > 1024px | Full sidebar, 3-column grid, all views |

---

## 8. Accessibility Requirements

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Enter/Space to activate
   - Escape to close modals/dropdowns
   - Cmd+K for command palette

2. **Screen Readers**
   - Semantic HTML (nav, main, article, section)
   - ARIA labels on icon buttons
   - Live regions for notifications
   - Descriptive link text

3. **Focus Management**
   - Visible focus rings (`ring-2 ring-[#6366F1]`)
   - Focus trap in modals
   - Return focus after modal close

4. **Color Contrast**
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text/borders
   - Don't rely on color alone for information

---

*Document version: 2.0*
*Reference apps: Monday.com, ClickUp, Trello, Jira*
*Design system: myOperator + TaskPilot custom tokens*
