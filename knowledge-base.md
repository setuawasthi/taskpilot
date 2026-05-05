# TaskPilot — Comprehensive Project Knowledge Base

> Storehouse for all prompts, image analysis, information architecture, and project context.
> Last updated: Apr 29, 2026 (v3 — added Monday.com references + TaskPilot MVP features)

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack & Architecture](#2-technology-stack--architecture)
3. [Information Architecture (Current)](#3-information-architecture-current)
4. [Jira PM App Feature Reference](#4-jira-pm-app-feature-reference)
5. [Trello Feature Reference](#5-trello-feature-reference)
6. [ClickUp Feature Reference](#6-clickup-feature-reference)
7. [Monday.com Feature Reference](#7-mondaycom-feature-reference)
8. [Cross-Tool Comparison Matrix](#8-cross-tool-comparison-matrix)
9. [Prompts Library](#9-prompts-library)
10. [UI Bug Fixes Log](#10-ui-bug-fixes-log)
11. [Design System Rules](#11-design-system-rules)
12. [Current Page Inventory](#12-current-page-inventory)
13. [Feature Gap Analysis](#13-feature-gap-analysis)
14. [Session Context & Decisions](#14-session-context--decisions)

---

## 1. Project Overview

**Project Name:** TaskPilot
**Type:** Project Management Dashboard (Jira-style PM tool)
**Status:** In active development — core pages built, many features missing
**Purpose:** Single-page Vite + React app serving as a UI surface for myOperator, modeled after Jira/Asana-style project management

---

## 2. Technology Stack & Architecture

| Layer | Technology |
|-------|-----------|
| Bundler | Vite |
| Framework | React 18 |
| Styling | Tailwind CSS v4 |
| Routing | Hash-based (`window.location.hash`), NO react-router |
| UI Components | Custom + shadcn/ui primitives (Button, Card, Input, etc.) |
| State | React Context (`DataContext`) with demo data |
| Icons | Lucide React |
| Font | Source Sans Pro (inline import) |

### File Structure
```
src/
├── App.jsx              # Hash router: #signup → SignupPage, else → LoginPage
├── main.jsx             # React root
├── index.css            # Tailwind v4 import
├── pages/
│   ├── Dashboard.jsx    # Main dashboard with tasks/issues/activity
│   ├── Tasks.jsx        # Task list + kanban board views
│   ├── TaskDetail.jsx   # Individual task view
│   ├── Projects.jsx     # Project list/table
│   ├── ProjectDetail.jsx# Single project view
│   ├── Issues.jsx       # Issues/bugs tracker
│   ├── Calendar.jsx     # Calendar view
│   ├── TimeLogs.jsx     # Time tracking
│   ├── Reports.jsx      # Analytics & charts
│   ├── Settings.jsx     # User preferences
│   ├── LoginPage.jsx    # Login screen
│   └── SignupPage.jsx   # Signup screen
├── layouts/
│   └── MainLayout.jsx   # Sidebar + main content wrapper
├── components/
│   ├── ui/              # shadcn primitives (button, card, input, etc.)
│   └── DashboardWidgets.jsx
├── context/
│   └── DataContext.jsx  # Demo data: projects, tasks, users, timelogs, activities, issues
└── lib/
    └── utils.js         # cn() utility
```

### Routing Convention (Hash-based)
```jsx
// App.jsx
const route = window.location.hash.replace('#', '') || '/'
switch(route) {
  case 'signup': return <SignupPage />
  default: return <LoginPage />
}
// Navigation: window.location.hash = 'tasks'
```

---

## 3. Information Architecture (Current)

### 3.1 Data Models (from DataContext.jsx)

#### Project
```js
{
  id: 'p1',
  name: 'Website Redesign',
  status: 'Active',
  startDate: Date,
  targetEndDate: Date,
  managerId: 'u1',
  description: '...',
  completionPercent: 45
}
```

#### Task
```js
{
  id: 't1',
  projectId: 'p5',
  taskListId: 'tl1',
  title: 'sign up journey improvement',
  status: 'In Progress', // 'To Do' | 'In Progress' | 'Done'
  priority: 'High',      // 'Low' | 'Medium' | 'High' | 'Critical'
  assigneeId: 'u6',
  dueDate: Date,
  startDate: Date,
  duration: 4,
  completionPercent: 98,
  tags: ['UX'],
  timelogTotal: 16
}
```

#### Issue
```js
{
  id: 'i1',
  projectId: 'p1',
  title: 'Login button not responding',
  status: 'Open', // 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  severity: 'High', // 'Low' | 'Medium' | 'High' | 'Critical'
  reporterId: 'u3',
  assigneeId: 'u2',
  createdAt: Date
}
```

#### User
```js
{
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@company.com',
  role: 'Manager',
  avatar: 'AJ'
}
```

#### TimeLog
```js
{
  id: 'tl1',
  projectId: 'p5',
  taskId: 't1',
  userId: 'u6',
  title: 'sign up journey improvement',
  dailyLogHours: 4,
  date: Date,
  billingType: 'Billable',
  notes: 'Refined onboarding screens'
}
```

#### Activity
```js
{
  id: 'a1',
  userId: 'u6',
  action: 'moved task to In Progress',
  targetType: 'Task',
  targetId: 't1',
  targetName: 'sign up journey improvement',
  timestamp: Date
}
```

### 3.2 Navigation Structure
```
├── / (Dashboard)
│   ├── Stats row (Open Tasks, Completed, Overdue, Issues, Hours)
│   ├── Tasks widget (Overdue | Upcoming | Done)
│   ├── Issues widget
│   ├── Activity feed
│   └── Quick links (Projects, Calendar)
├── /projects
│   └── /projects/:id (Project Detail → Tasks, Issues, Overview tabs)
├── /tasks
│   └── /tasks/:id (Task Detail)
├── /issues
├── /calendar
├── /timelogs
├── /reports
├── /settings
├── /login
└── /signup
```

---

## 4. Jira PM App Feature Reference

> Extracted from 4 reference images showing a complete Jira-style project management app feature tree.

### 4.1 Onboarding
- [ ] Creating a site / workspace
- [ ] Adding a status
- [ ] Subscribing to a plan

### 4.2 Space Dashboard
- [x] Dashboard view (TaskPilot has basic version)
- [ ] Creating a task
  - [ ] Formatting text
  - [ ] Editing text color
  - [ ] Uploading a file
  - [ ] Adding code blocks
  - [ ] Adding action items
  - [ ] Adding emoji
  - [ ] Adding tables
  - [ ] Adding labels
  - [ ] Selecting a role

### 4.3 Task Detail (Comprehensive)
- [x] Renaming a task
- [x] Updating task details
- [ ] Creating a subtask
- [ ] Adding a linked task
- [x] Commenting on a task
- [ ] Adding a work log
- [ ] Changing sort direction
- [ ] Pinning a field
- [ ] Restricting a task
- [ ] Sharing a task
- [ ] Adding a flag
- [ ] Adding a parent
- [ ] Duplicating a task
- [ ] Moving a task
- [ ] Archiving a task
- [ ] Deleting a task
- [ ] Exporting a task
- [x] Adding an assignee
- [x] Updating task priority
- [ ] Filtering tasks with AI
- [ ] Searching tasks
- [ ] Filtering tasks
- [ ] Removing a filter
- [ ] Printing a list

### 4.4 Views & Visualization
- [ ] View work items as a chart
- [ ] Formatting rules
- [ ] Turning off hierarchy
- [ ] Filtering summary
- [ ] Status overview
- [ ] Grouping tasks
- [ ] Board insights
- [ ] Updating board view settings
- [ ] Starting a standup

### 4.5 Workflow Management
- [ ] Workflow management
  - [ ] Creating a transition
  - [ ] Adding a rule
- [ ] Unscheduled work
- [ ] Updating calendar settings
- [ ] Sorting tasks based on time
- [ ] Export as an image

### 4.6 Pages & Documents
- [ ] Commenting on a page
- [ ] Creating a page
- [ ] Creating a form
  - [ ] Creating a field
- [ ] Deactivating a form
- [ ] Adding a view
- [ ] Cumulative flow diagram

### 4.7 Space Management
- [ ] Adding a shortcut
- [ ] Updating a project icon
- [x] Adding a team (basic users only)
- [ ] Starring a space
- [ ] Updating a space background
- [ ] Archiving a space
- [ ] Deleting a space
- [ ] Hiding spaces from sidebar

### 4.8 Planning
- [ ] Creating a demo plan
- [ ] Completing a guidelist (plan)
- [ ] Demo plan
  - [ ] Creating a program board
  - [ ] Updating unsaved changes
- [ ] Dependencies

### 4.9 Search & Discovery
- [ ] Customizing sidebar
- [ ] Searching Jira

### 4.10 Notifications
- [ ] Notifications center

### 4.11 Profile & Teams
- [x] Profile (basic)
- [ ] Uploading an avatar
- [ ] Updating profile
- [ ] Creating a team
- [ ] Updating a team
- [ ] Leaving a team
- [ ] Logging out

### 4.12 Space Settings
- [ ] Renaming a space
- [ ] Adding a member
- [ ] Creating a role
- [ ] Updating a role
- [ ] Deleting a member
- [ ] Adding a notification

### 4.13 Automation
- [ ] Creating an automation
- [ ] Automation performance insights
- [ ] Adding a field
- [ ] Updating a work type
- [ ] Hiding a status
- [ ] Creating a custom filter
- [ ] Turning off card cover images

### 4.14 Personal Settings
- [ ] Switching to dark mode
- [ ] Turning off email notifications

### 4.15 Jira Settings (System)
- [ ] Adding a gadget
- [ ] Switching to fullscreen mode
- [ ] Updating highlight color
- [ ] Updating dashboard layout
- [ ] Publishing an announcement

### 4.16 Jira Settings (Apps)
- [ ] Creating custom onboarding
- [ ] Adding a link
- [ ] Adding a background image
- [ ] Updating permissions

### 4.17 Jira Settings (Spaces)
- [ ] Adding a space category
- [ ] Restoring a space

### 4.18 Jira Settings (Work Items)
- [ ] Updating a status name
- [ ] Canceling a subscription

### 4.19 Account Settings
- [ ] Updating visibility
- [ ] Changing password
- [ ] Setting up two-step verification
  - [ ] Disabling two-step verification
- [ ] Updating link preferences
- [ ] Logging in
- [ ] Resetting password

---

## 5. Trello Feature Reference

> Extracted from 3 reference images showing Trello's complete feature tree.
> **Platform:** iOS, Android, Web

### 5.1 Onboarding
- [ ] Completing a guided tour
- [ ] Subscribing to a plan

### 5.2 Board Management
- [ ] Creating a board
  - [ ] Adding a card
    - [ ] Adding a label
    - [ ] Adding dates
    - [ ] Adding a checklist
    - [ ] Adding a member
    - [ ] Adding an attachment
    - [ ] Adding a location
    - [ ] Adding a custom field
    - [ ] Adding a description
    - [ ] Adding a comment
    - [ ] Showing activity details
    - [ ] Marking a card as complete
    - [ ] Moving a card
    - [ ] Updating cover image
    - [ ] Making a template
    - [ ] Sharing a card
    - [ ] Deleting a card
    - [ ] Adding a card (from template)
    - [ ] Collapsing a list
    - [ ] Copying a list
    - [ ] Moving a list
    - [ ] Changing a list color
    - [ ] Adding an automation rule
    - [ ] Adding a list
    - [ ] Creating a workspace view
    - [ ] Creating a board (from template)

### 5.3 Home & Inbox
- [ ] Home
  - [ ] Dismissing a card
- [ ] Boards
  - [ ] Showing Inbox
    - [ ] Adding emails from email
    - [ ] Filtering inbox
    - [ ] Sorting inbox
    - [ ] Restoring an archive
    - [ ] Changing background image
  - [ ] Showing planner
    - [ ] Connecting a calendar
    - [ ] Adding a card to planner
    - [ ] Updating connected calendar
    - [ ] Changing calendar range

### 5.4 Board Views & Switching
- [ ] Switching a board
  - [ ] Switching view to list
  - [ ] Switching view to table
    - [ ] Reordering lists
    - [ ] Adding a label (table)
  - [ ] Switching view to calendar
    - [ ] Adding a card (calendar)
  - [ ] Switching view to dashboard
    - [ ] Editing a chart
    - [ ] Adding a chart
  - [ ] Switching view to timeline
    - [ ] Adding a card (timeline)
    - [ ] Adding a list (timeline)
  - [ ] Switching view to quarter
  - [ ] Switching view to member
  - [ ] Switching view to label
  - [ ] Switching view to map
    - [ ] Adding a card (map)

### 5.5 Member & Activity
- [ ] Editing profile info
- [ ] Showing a member's activity

### 5.6 Power-Ups & Automation
- [ ] Adding power-ups
  - [ ] Adding a list (power-ups)
- [ ] Creating an automation (rule)
- [ ] Removing a rule

---

## 6. ClickUp Feature Reference

> Extracted from 10 reference images showing ClickUp's complete feature tree.
> **Platform:** iOS, Web, Site | **Rating:** 4.15 (9) | **Category:** Productivity, Collaboration

### 6.1 Onboarding
- [ ] Setting up a workspace
  - [ ] Uploading an avatar (workspace)
  - [ ] Watching video
- [ ] Creating a space
  - [ ] Selecting space color
  - [ ] Deleting a space

### 6.2 Task Creation
- [ ] Adding a task
  - [ ] Adding due date
  - [ ] Setting priority
  - [ ] Adding a custom field
  - [ ] Inviting a teammate
  - [ ] Opening task detail (tour)
- [ ] Creating a task (detailed)
  - [ ] Minimizing a draft
  - [ ] Assigning tasks
  - [ ] Adding description
  - [ ] Adding subtasks
  - [ ] Adding a checklist
  - [ ] Saving as a template
  - [ ] Setting dependencies
  - [ ] Publishing a task
  - [ ] Adding a task (from template)

### 6.3 Task Detail
- [ ] Changing task status
- [ ] Creating a field
- [ ] Filtering subtasks by assignee
- [ ] Tracking time (timer)
- [ ] Tracking time (manual)
- [ ] Tracking time (range)
- [ ] Switching to list view (attachments)
- [ ] Adding a comment (task)
  - [ ] Mentioning a task
- [ ] Changing a subtask status
- [ ] Filtering activities
- [ ] Hiding completed items
- [ ] View task mention
  - [ ] Liking a comment
  - [ ] Adding comment to description
  - [ ] Replying to a comment

### 6.4 List Management
- [ ] List detail
  - [ ] Editing list name
  - [ ] Sharing list
  - [ ] Editing list color
  - [ ] Minimizing list view
  - [ ] Moving a task
  - [ ] Calculating due dates
  - [ ] Showing subtasks
  - [ ] Filtering tasks by assignees
  - [ ] Changing group by filter
- [ ] Switching to board view
  - [ ] Closing a task
  - [ ] Reordering tasks (board view)
  - [ ] Merging tasks
  - [ ] Linking tasks
- [ ] Switching to table view
- [ ] Adding a calendar view
- [ ] Adding a timeline view
  - [ ] Editing task duration (timeline)
- [ ] Adding a mind map view
- [ ] Adding a workload view
- [ ] Adding a chat page
- [ ] Adding an embed page
- [ ] Showing closed tasks
- [ ] Adding a column (checkbox)
- [ ] Adding a new status
- [ ] Pinning a view
- [ ] Adding automation (change assignee)
- [ ] Exporting a view
- [ ] Marking as milestones
- [ ] Commenting on a list
- [ ] Deleting a list view
- [ ] Changing list color (detail)

### 6.5 Lists & Sprints
- [ ] Creating a list
  - [ ] Adding to favorites
    - [ ] Unfavoriting an item
  - [ ] Duplicating a list
  - [ ] Moving a list
  - [ ] Converting a list to sprint
  - [ ] Create tasks by email
  - [ ] Creating a list (from template)
  - [ ] Archiving a list

### 6.6 Forms
- [ ] Creating a form
  - [ ] Editing form details
  - [ ] Adding task fields
    - [ ] Removing a task field
    - [ ] Adding a custom field (form)
  - [ ] Copying embed code
  - [ ] Adding automation (email)
  - [ ] Submitting a form
  - [ ] View feedback results

### 6.7 Whiteboards
- [ ] Creating a whiteboard
  - [ ] Completing a guided tour
  - [ ] Adding a ClickUp task
  - [ ] Adding a website card
  - [ ] Drawing on whiteboard
  - [ ] Adding a shape
    - [ ] Adding text to a shape
  - [ ] Adding a sticky note
  - [ ] Adding connectors
  - [ ] Adding a mind map
  - [ ] Sending an item behind
  - [ ] Adding a whiteboard template
  - [ ] Uploading an image to whiteboard
  - [ ] Adding a ClickUp doc
  - [ ] Adding a Figma card
- [ ] Creating a folder

### 6.8 Dashboards
- [ ] Creating a dashboard
  - [ ] Resizing widgets
  - [ ] Creating a dashboard (custom)
  - [ ] Adding a time report card
  - [ ] Adding a task list card
  - [ ] Adding an activity view card
  - [ ] Adding a chat card
  - [ ] Reordering dashboard
  - [ ] Filtering dashboard
  - [ ] Turning off auto-refresh
  - [ ] Task performance
    - [ ] Showing legend
    - [ ] Sorting priority breakdown
  - [ ] Editing dashboard name
  - [ ] Opening dashboard in fullscreen

### 6.9 Docs (Documents)
- [ ] Creating a doc
  - [ ] Adding icon and cover
  - [ ] Changing fonts
  - [ ] Editing page settings
  - [ ] Adding page links
  - [ ] Using a template
  - [ ] Reordering pages
  - [ ] Closing sidebars
  - [ ] Editing page details (quick)
  - [ ] Adding a table
    - [ ] Adding a link
    - [ ] Editing columns
  - [ ] Adding a ClickUp list table
    - [ ] Minimizing a ClickUp table
    - [ ] Resizing table width
    - [ ] Reordering columns
  - [ ] Adding a banner
  - [ ] Changing toolbar position
  - [ ] Adding column section
    - [ ] Adding a button
    - [ ] Adding a code block
    - [ ] Adding table of content
    - [ ] Adding a file attachment
    - [ ] Adding an image
      - [ ] Adding comments to an image
  - [ ] Writing with AI
  - [ ] Summarizing with AI
  - [ ] Adding a doc to favorites
  - [ ] Adding to tray
  - [ ] Adding comments to a doc
  - [ ] Enabling public sharing
- [ ] Docs management
  - [ ] Adding a doc to a task
  - [ ] Tagging docs
  - [ ] Archiving docs
  - [ ] Switching to grid view (docs)

### 6.10 Goals & Pulse
- [ ] Pulse
  - [ ] Filtering Pulse
- [ ] Creating a goal
  - [ ] Creating a target
    - [ ] Adding unit
    - [ ] Completing a target
    - [ ] Updating a target
    - [ ] Changing goal color

### 6.11 Home & Reminders
- [ ] Home
  - [ ] Creating a reminder
    - [ ] Delegating a reminder
    - [ ] Adding tasks to LineUp
  - [ ] Creating a task (calendar)
- [ ] Notifications

### 6.12 Workspace Settings
- [ ] Accepting an invitation
- [ ] Workspace settings
  - [ ] Changing workspace info
  - [ ] Converting a member to guest
  - [ ] Changing guest permissions
  - [ ] Canceling an invite
  - [ ] Creating a team
    - [ ] Adding members to a team
    - [ ] View a member's profile (quick)
  - [ ] Archiving a space
  - [ ] Importing CSV
  - [ ] Exporting data
  - [ ] Filtering ClickApps
  - [ ] Connecting Google Calendar
  - [ ] Enabling email ClickApp
  - [ ] Creating an app
  - [ ] Billing
  - [ ] Restoring an item
  - [ ] Security & Permissions

### 6.13 User Settings
- [ ] My settings
  - [ ] Uploading custom avatar
  - [ ] Enabling two-factor authentication
  - [ ] Deleting account
  - [ ] My workspaces
  - [ ] Changing notification settings
- [ ] Creating a new workspace
  - [ ] Switching workspaces

### 6.14 Quick Actions & UI
- [ ] Quick actions
  - [ ] Changing layout size & style
    - [ ] Creating a portfolio
    - [ ] Reporting
  - [ ] Switching to dark sidebar
  - [ ] Help
  - [ ] Hotkeys
  - [ ] Switching to dark mode
  - [ ] Recording a clip (quick)
  - [ ] Tracking time (quick)
  - [ ] Creating a notepad
  - [ ] Creating a whiteboard (quick)
  - [ ] Pinning quick actions
  - [ ] Moving help widget
  - [ ] Removing widgets
  - [ ] Collapsing sidebar
- [ ] Searching ClickUp
- [ ] Logging out

### 6.15 Auth
- [ ] Logging in
  - [ ] Resetting password

### 6.16 Landing & Marketing
- [ ] Landing page
  - [ ] ClickUp AI
- [ ] Product
  - [ ] Tasks
  - [ ] Docs (features)
  - [ ] All features
  - [ ] Templates
    - [ ] Template detail
    - [ ] Searching templates
  - [ ] ClickApps
  - [ ] Integrations
    - [ ] Searching integrations
    - [ ] Integration detail
  - [ ] Hierarchy
  - [ ] Solutions
    - [ ] Software development
    - [ ] Operations
    - [ ] All solutions
    - [ ] Remote work
    - [ ] Startup
- [ ] Learn
  - [ ] Getting started
  - [ ] ClickUp university
    - [ ] Browse ClickUp university
    - [ ] Searching ClickUp university
    - [ ] Live training
    - [ ] Logging in (ClickUp university)
    - [ ] Course detail
    - [ ] Buy workshop
  - [ ] Import
  - [ ] Customer stories
    - [ ] Customer story detail
    - [ ] Downloading case study
  - [ ] Professional services
  - [ ] Partner program
    - [ ] Partner directory
  - [ ] Blog
    - [ ] Writer detail
    - [ ] Subscribing to newsletter
    - [ ] Blog article detail
    - [ ] Browse blog
    - [ ] Searching blog
- [ ] Pricing
- [ ] Enterprise
- [ ] Contact sales
- [ ] Download
- [ ] Careers
  - [ ] Filtering job openings
- [ ] About us
- [ ] Press
- [ ] Brand
- [ ] Affiliates
- [ ] Reviews
- [ ] Help center
  - [ ] Help article detail
  - [ ] Searching help center
  - [ ] Chatting with chatbot
- [ ] Webinars
- [ ] API
- [ ] Events
  - [ ] Event detail
- [ ] To-do list
- [ ] Competitor comparison (Monday)
- [ ] Competitor comparison (Notion)
- [ ] Software development hub
  - [ ] Software development hub article
- [ ] PM software guide
- [ ] Newsletter
- [ ] Podcast
  - [ ] Playing trailer
  - [ ] Podcast episode detail
- [ ] Security
- [ ] Privacy policy
- [ ] Terms & conditions
- [ ] 404

---

## 7. Monday.com Feature Reference

> Extracted from 4 reference images showing Monday.com's complete feature tree.
> **Platform:** iOS, Android, Web, Site | **Rating:** 5.0 (2) | **Category:** Work Management

### 7.1 Onboarding & Workspace
- [ ] Inviting teammates
- [ ] Creating a board
- [ ] Adding a new workspace
  - [ ] Adding workspace description
- [ ] Adding a new folder
  - [ ] Changing folder color

### 7.2 Board / Project Management
- [ ] Editing project name
- [ ] Adding emoji
- [ ] Showing board description
- [ ] Adding description
- [ ] Adding board to favorites
- [ ] Adding board members
- [ ] Editing board permissions
- [ ] Changing board type
- [ ] Muting board notifications
- [ ] Board archive
- [ ] Board trash
  - [ ] Deleting trash permanently
- [ ] Duplicating board
- [ ] Reordering groups
- [ ] Searching board
- [ ] Filtering by person
- [ ] Filtering board
  - [ ] Filtering by quick filters
- [ ] Sorting board
- [ ] Hiding columns
- [ ] Pinning columns
- [ ] Adjusting item height
- [ ] Adding conditional coloring
- [ ] Editing item default values
- [ ] Adding a new group

### 7.3 Task / Item Management
- [ ] Adding a task
  - [ ] Adding an update (comment)
  - [ ] Adding a person (assignee)
  - [ ] Updating status
  - [ ] Adding date
- [ ] Task detail
  - [ ] Liking an update
  - [ ] Replying to an update
  - [ ] Copying email address
  - [ ] Setting a reminder
  - [ ] Pinning an update
  - [ ] Copying link to update
  - [ ] Uploading a file
  - [ ] Switching to list view
  - [ ] Downloading files
  - [ ] File detail
- [ ] Reordering groups

### 7.4 Views
- [ ] Timeline view
  - [ ] Opening full screen
  - [ ] Switching to split view
  - [ ] Customizing view
- [ ] Dashboard view
  - [ ] Adding widgets
  - [ ] Widget detail
    - [ ] Changing display type
  - [ ] Adding a widget (widgets center)
  - [ ] Reordering widgets
- [ ] Adding Kanban view
- [ ] Adding Gantt view
- [ ] Adding Cards view
- [ ] Adding a view (views center)
  - [ ] Adding view to favorites

### 7.5 Automations
- [ ] Automations center
  - [ ] Creating a custom automation
  - [ ] Adding automation task
  - [ ] Removing automation task
  - [ ] Saving automation as template
  - [ ] Automations activity
  - [ ] Account usage

### 7.6 Integrations & Apps
- [ ] Integration center
  - [ ] Board integrations
  - [ ] Adding an integration
- [ ] App marketplace
  - [ ] App detail
  - [ ] Adding an app
  - [ ] Installed apps
  - [ ] Rating an app

### 7.7 Docs & Content
- [ ] Creating a new doc
  - [ ] Showing outline
  - [ ] Adding cover
  - [ ] Formatting text
  - [ ] Adding a comment
  - [ ] Duplicating text
  - [ ] Editing text
  - [ ] Reordering text
  - [ ] Editing doc style
  - [ ] Sharing doc
  - [ ] Version history
  - [ ] Archiving doc

### 7.8 User Profile & Settings
- [ ] My work
  - [ ] Hiding done items
- [ ] Me profile
  - [ ] Changing avatar theme
  - [ ] Changing profile picture
  - [ ] Adding a title
  - [ ] Copying title
  - [ ] Adding work anniversary
  - [ ] Updating working status
  - [ ] Changing password
- [ ] Switching to dark mode
- [ ] Short keys dialog

### 7.9 Administration
- [ ] Exporting account data
- [ ] Changing logo
- [ ] Reordering board labels
- [ ] Adding custom field
- [ ] Closing account
- [ ] Upgrade plan
  - [ ] Chatting with chatbot
- [ ] Teams
  - [ ] Creating a new team
  - [ ] Changing cover
  - [ ] Manage users
    - [ ] Adding users to team

### 7.10 Auth & Account
- [ ] Logging in
  - [ ] Resetting password
- [ ] Logging out
- [ ] Completing profile
- [ ] Sending link to mobile
- [ ] Changing theme
- [ ] Turning on do not disturb

### 7.11 Templates & Marketplace
- [ ] Templates
  - [ ] Template detail
  - [ ] Searching templates
- [ ] Sales CRM
  - [ ] Features
  - [ ] Adding a contact
  - [ ] Adding an account
  - [ ] Deals
    - [ ] Closing a deal
  - [ ] Sales dashboard
- [ ] Marketer
  - [ ] Submitting survey
  - [ ] Completing onboarding tour
  - [ ] Content calendar
- [ ] Enterprise
- [ ] Nonprofit
  - [ ] Success story detail
  - [ ] Eligibility
  - [ ] Pricing (Nonprofit)

---

## 8. Cross-Tool Comparison Matrix

> Comparing features across Monday.com, Jira, Trello, and ClickUp to identify the most common / essential PM features.

### 8.1 Core Task Management (Universal)
| Feature | Monday | Jira | Trello | ClickUp | TaskPilot |
|---------|--------|------|--------|---------|-----------|
| Create task/card | ✅ | ✅ | ✅ | ✅ | ✅ |
| Task title & description | ✅ | ✅ | ✅ | ✅ | ✅ |
| Due dates | ✅ | ✅ | ✅ | ✅ | ✅ |
| Assign members | ✅ | ✅ | ✅ | ✅ | ✅ |
| Labels/tags | ✅ | ✅ | ✅ | ✅ | ✅ |
| Priority levels | ❌ (colors) | ✅ | ❌ (labels) | ✅ | ✅ |
| Status/stage | ✅ | ✅ | ✅ (lists) | ✅ | ✅ |
| Comments | ✅ (updates) | ✅ | ✅ | ✅ | ✅ |
| Attachments/files | ✅ | ✅ | ✅ | ✅ | ❌ |
| Checklists/subtasks | ❌ | ✅ (subtasks) | ✅ | ✅ | ✅ |
| Activity log/history | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mark complete | ✅ | ✅ | ✅ | ✅ | ✅ |
| Move task | ✅ | ✅ | ✅ | ✅ | ✅ (board arrows) |
| Copy/duplicate task | ✅ | ✅ | ❌ | ✅ | ✅ |
| Delete task | ✅ | ✅ | ✅ | ✅ | ✅ |
| Archive task | ✅ (board trash) | ✅ | ✅ (archive) | ✅ | ✅ |
| Flag task | ❌ | ✅ | ❌ | ❌ | ✅ |

### 8.2 Views & Visualization
| Feature | Monday | Jira | Trello | ClickUp | TaskPilot |
|---------|--------|------|--------|---------|-----------|
| List view | ✅ | ✅ | ✅ (default) | ✅ | ✅ |
| Board/Kanban view | ✅ | ✅ | ✅ | ✅ | ✅ |
| Table view | ✅ | ✅ | ✅ | ✅ | ✅ |
| Calendar view | ✅ | ✅ | ❌ | ✅ | ✅ |
| Timeline/Gantt view | ✅ | ✅ | ✅ (timeline) | ✅ | ❌ |
| Dashboard/charts | ✅ (widgets) | ✅ | ✅ (dashboard) | ✅ | ✅ (basic) |
| Map view | ❌ | ❌ | ✅ | ❌ | ❌ |
| Mind map | ❌ | ❌ | ❌ | ✅ | ❌ |
| Workload view | ❌ | ❌ | ❌ | ✅ | ❌ |
| Cards view | ✅ | ❌ | ❌ | ❌ | ❌ |

### 8.3 Advanced Features
| Feature | Monday | Jira | Trello | ClickUp | TaskPilot |
|---------|--------|------|--------|---------|-----------|
| Subtasks | ❌ | ✅ | ✅ (checklist) | ✅ | ✅ |
| Linked tasks | ❌ | ✅ | ❌ | ✅ | ✅ |
| Dependencies | ❌ | ✅ | ❌ | ✅ | ✅ |
| Custom fields | ✅ | ✅ | ✅ | ✅ | ❌ |
| Automation/rules | ✅ | ✅ | ✅ (Butler) | ✅ | ❌ |
| Templates | ✅ | ✅ | ✅ | ✅ | ❌ |
| Forms | ❌ | ✅ | ❌ | ✅ | ❌ |
| Time tracking | ❌ | ✅ | ❌ | ✅ | ✅ |
| Work logs | ❌ | ✅ | ❌ | ✅ | ✅ |
| Sprint management | ❌ | ✅ | ❌ | ✅ | ❌ |
| Goals/targets | ❌ | ❌ | ❌ | ✅ | ❌ |
| Whiteboards | ❌ | ❌ | ❌ | ✅ | ❌ |
| Docs/pages | ✅ | ✅ | ❌ | ✅ | ❌ |
| AI features | ❌ | ✅ | ❌ | ✅ | ❌ |
| Task flagging | ❌ | ✅ | ❌ | ❌ | ✅ |

### 8.4 Workspace & Team
| Feature | Monday | Jira | Trello | ClickUp | TaskPilot |
|---------|--------|------|--------|---------|-----------|
| Workspaces/spaces | ✅ | ✅ | ✅ | ✅ | ❌ (projects only) |
| Teams | ✅ | ✅ | ✅ | ✅ | ✅ (basic) |
| Roles/permissions | ✅ | ✅ | ❌ | ✅ | ✅ (basic) |
| Guest access | ✅ | ✅ | ✅ | ✅ | ❌ |
| Member profiles | ✅ | ✅ | ✅ | ✅ | ✅ (basic) |
| Activity feed | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ |
| Search | ✅ | ✅ | ✅ | ✅ | ✅ (Cmd+K) |
| Filters | ✅ | ✅ | ✅ | ✅ | ✅ |
| Import/Export | ✅ | ✅ | ❌ | ✅ | ❌ |
| Dark mode | ❌ | ❌ | ❌ | ✅ | ✅ |
| My Work / Home | ✅ | ✅ (Your Work) | ❌ | ✅ (Home) | ✅ |

---

## 8.5. MVP Competitive Analysis & Changes Log

> Analysis performed Apr 28, 2026 across Jira, Trello, ClickUp, and Monday.com to identify TaskPilot MVP gaps.

### 8.1 Critical Findings

| # | Gap | Severity | Competitive Impact |
|---|-----|----------|-------------------|
| 1 | **No Task Detail Page** | 🔴 Critical | Every PM tool has this. Tasks were trapped in table rows. |
| 2 | **No Subtasks / Checklists** | 🔴 Critical | Jira, Trello, ClickUp all support task breakdown. |
| 3 | **No Task Comments** | 🔴 Critical | Collaboration requires per-task commenting. |
| 4 | **Task rows not clickable** | 🟠 High | Breaks basic UX navigation flow. |
| 5 | **No inline status editing** | 🟠 High | All competitors allow quick status changes without opening a dialog. |
| 6 | **Tags have no colors** | 🟡 Medium | Trello/ClickUp use color-coded labels for visual scanning. |
| 7 | **No task descriptions** | 🟠 High | Tasks only had titles, no rich context. |
| 8 | **Kanban cards not clickable** | 🟠 High | Board view existed but cards didn't open detail. |

### 8.2 Changes Implemented (Apr 28, 2026)

#### ✅ Created `src/pages/TaskDetail.jsx`
- Full task detail view with breadcrumb navigation
- Task header: title, inline status dropdown, priority badge, colored labels, due date, assignee
- **Description section** — shows task context
- **Subtasks checklist** — toggle completion, add new subtasks, delete subtasks, progress bar
- **Comments section** — add comments with Enter key, threaded display, timestamps
- **Activity feed** — filtered to task-specific activities
- **Metadata sidebar** — project link, assignee, due date, priority, progress bar, time logged, colored tags
- **Time logs** — shows logs for this specific task
- All using shadcn components: Card, Select, Badge, Avatar, Textarea, Input, Button, Separator, ScrollArea

#### ✅ Updated `src/context/DataContext.jsx`
- Added `description` field to all demo tasks
- Added `LABEL_COLORS` mapping for 10 tags with unique colors
- Added `getLabelColor()` utility function (exported)
- Added `demoSubtasks` array with 9 sample subtasks linked to tasks
- Added `demoTaskComments` array with 5 sample comments
- Added state: `subtasks`, `taskComments`
- Added CRUD: `getSubtasks`, `getTaskComments`, `createSubtask`, `updateSubtask`, `deleteSubtask`, `createTaskComment`, `deleteTaskComment`
- Updated `searchAll` to link tasks to `/tasks/:id`

#### ✅ Updated `src/App.jsx`
- Added route: `<Route path="/tasks/:id" element={<TaskDetail />} />`
- Imported `TaskDetail` component

#### ✅ Updated `src/pages/Tasks.jsx`
- Table rows are now **clickable** — navigate to task detail
- **Inline status editing** — Select dropdown in Status column (prevents nav when clicking the dropdown)
- **Label colors** — tags now use `getLabelColor()` for unique background/text/border colors
- **Kanban cards clickable** — click any card to open task detail
- Kanban arrow buttons use `e.stopPropagation()` to prevent navigation

#### ✅ Updated `src/pages/ProjectDetail.jsx`
- Task table rows are **clickable** — navigate to `/tasks/:id`
- Tags use **label colors** via `getLabelColor()`
- Imported `getLabelColor` from DataContext

#### ✅ Updated `src/pages/Dashboard.jsx`
- Task rows are **clickable** — navigate to individual task detail
- Added **label color tags** displayed next to task title (shows up to 2 tags)
- Removed unused `projects` prop from `TaskRow`

### 8.3 Updated MVP Feature Status

| Feature | Before | After |
|---------|--------|-------|
| Task Detail Page | ❌ | ✅ |
| Task Descriptions | ❌ | ✅ |
| Subtasks / Checklists | ❌ | ✅ |
| Task Comments | ❌ | ✅ |
| Clickable Task Rows | ❌ | ✅ |
| Inline Status Editing | ❌ | ✅ |
| Color-coded Labels | ❌ | ✅ |
| Clickable Kanban Cards | ❌ | ✅ |

### 8.4 Remaining MVP Gaps (Priority Order)

**High Priority:**
- [ ] Drag-and-drop Kanban (requires @dnd-kit or similar)
- [ ] Task attachments / file upload UI
- [ ] Task linking / dependencies
- [ ] Bulk actions on tasks (multi-select)
- [ ] Task templates
- [ ] Task duplication
- [ ] Archive functionality

**Medium Priority:**
- [ ] Rich text description editor
- [ ] Task time tracking inline (start/stop timer)
- [ ] Task filters (advanced)
- [ ] Task search within page
- [ ] Recurring tasks
- [ ] Custom fields

**Low Priority:**
- [ ] Automation rules
- [ ] Forms
- [ ] Whiteboards
- [ ] Docs/pages
- [ ] Mind maps
- [ ] AI features

---

## 9. Prompts Library

### 9.1 General Prompts

#### Add a new page with myOperator design
```
Create a new page component at src/pages/<PageName>.jsx that follows the myOperator design system.
- Use hash-based routing (window.location.hash)
- Include the full :root CSS token block as an inline string
- Use Tailwind utility classes with CSS custom properties (e.g., bg-[var(--semantic-primary)])
- Font: Source Sans Pro
- Rounded 4px for buttons/inputs, 8px for cards
- Add the route to App.jsx
```

#### Build a modal/dialog
```
Add a modal component to <file> for <purpose>.
Requirements:
- z-[9999] for the overlay (host app navbar sits above z-50)
- bg-black/50 backdrop
- Rounded-lg (8px) white card
- Close on backdrop click and Escape key
- Focus trap inside modal
- Use myOperator design tokens (inline css string)
```

#### Create a form with validation
```
Build a form in <component> with these fields: <list fields>.
- Tailwind-styled inputs with myOperator tokens
- Real-time or on-submit validation
- Error messages below inputs in red
- Submit button uses --semantic-brand for active state
- Disabled state uses --semantic-disabled-* tokens
- No hardcoded hex values
```

#### Style a data table
```
Create/update a data table in <component> using myOperator design system.
- Header row: bg-[var(--semantic-surface)] text-[var(--semantic-text-heading)]
- Rows: border-b border-[var(--semantic-border)]
- Hover state on rows
- Action buttons (edit/delete) with --semantic-brand accent
- Responsive: horizontal scroll on small screens
```

#### Add a sidebar / dashboard layout
```
Create a dashboard layout with a sidebar in src/App.jsx or a new layout component.
- Sidebar: fixed left, width ~250px, bg-[var(--semantic-primary)]
- Top nav bar if needed
- Main content area with proper padding
- Sidebar links use --semantic-brand for active/hover
- Collapsible on mobile (hamburger menu)
```

#### Fix / refactor a component
```
Refactor <component> to:
- Extract the inline CSS token block into a reusable design-tokens.js if DRY is preferred, OR keep it inline per project convention
- Ensure no hardcoded hex values in Tailwind classes
- Replace arbitrary values with design token variables where possible
- Preserve all existing functionality
```

#### Add a loading / empty state
```
Add a loading state and an empty state to <component>.
- Loading: spinner using --semantic-brand color
- Empty: friendly illustration or icon + message text-[var(--semantic-text-muted)]
- Both centered in their containers
```

#### Work with the hash router
```
I need to add navigation between pages in this hash-router app.
- Add a link/button that sets window.location.hash = '#<route>'
- Ensure App.jsx route switch handles the new hash
- Pass state via URL query params in the hash if needed (e.g., #page?id=123)
```

#### Apply myOperator design tokens to existing HTML/CSS
```
I have this existing markup/CSS: <paste code>
Convert it to use myOperator design tokens and Tailwind utilities.
- Replace all hardcoded colors with CSS custom properties
- Use rounded, rounded-lg correctly
- Ensure Source Sans Pro font
- Follow accessibility guidelines from the design system
```

#### Create a reusable button component
```
Create a reusable Button component in src/components/Button.jsx.
Variants:
- Primary: bg-[var(--semantic-primary)] text-white
- Secondary: border border-[var(--semantic-border)] bg-white
- Danger: bg-red-600 text-white
- Ghost: transparent, text-[var(--semantic-text-body)]
States: hover, active, disabled (use --semantic-disabled-*)
Props: variant, size (sm/md/lg), disabled, onClick, children
```

### 5.2 TaskPilot-Specific Prompts

#### Build a task detail page
```
Create a TaskDetail page at src/pages/TaskDetail.jsx following the Jira reference:
- Shows task title, status, priority, assignee, due date
- Comments section with add comment input
- Activity/history feed
- Sidebar with metadata (tags, time logged, project)
- Actions: edit, delete, mark complete
- Use hash routing: #tasks/:id
```

#### Add subtasks to tasks
```
Add subtask support to the Task model and TaskDetail view:
- Subtask data structure: { id, title, status, parentId }
- Checkbox to toggle completion
- Inline add subtask input
- Nested display under parent task
- Update DataContext with demo subtasks
```

#### Build a Kanban board view
```
Create a Kanban board view for Tasks page:
- Columns: To Do, In Progress, Done
- Draggable cards (or click to move)
- Each card shows: title, assignee avatar, priority badge, due date
- Use shadcn Card component as base
- Toggle between list view and board view
```

#### Add notifications center
```
Build a notifications dropdown/panel:
- Bell icon in header with unread count badge
- Dropdown list of recent activities mentioning current user
- Mark as read / mark all read
- Link to relevant task/project
- Use demo notifications from DataContext
```

#### Add dark mode toggle
```
Add dark mode support to TaskPilot:
- Toggle in Settings or header
- CSS variables for dark theme
- Persist preference in localStorage
- Apply dark class to html element
- Ensure all components respond to dark mode
```

---

## 10. UI Bug Fixes Log

### Fix 1: Dashboard TaskRow vertical stacking
**Date:** Apr 28, 2026
**File:** `src/pages/Dashboard.jsx`
**Issue:** Task items in Dashboard widget were stacking vertically (icon above title above date) instead of horizontal row.
**Root Cause:** `TaskRow` used `<Card>` component which has `flex flex-col` as default styles. The `flex items-center` class was being overridden by `flex-col`.
**Fix:** Replaced `<Card>` with `<div>` and explicitly set `flex flex-row items-center`.
```jsx
// Before (broken):
<Card className="flex items-center gap-3 ...">

// After (fixed):
<div className="flex flex-row items-center gap-3 ...">
```

---

## 11. Design System Rules

### 11.1 myOperator Design Tokens (Key Rules)
| Token | Value | Usage |
|-------|-------|-------|
| `--semantic-brand` | #2BBCCA | Interactive accents ONLY: focus rings, links, active states |
| `--semantic-primary` | #343E55 | Data viz, primary UI elements |
| `--semantic-disabled-bg` | ... | Disabled backgrounds |
| `--semantic-disabled-text` | ... | Disabled text |

### 11.2 Critical Styling Rules
- **Font:** Source Sans Pro (imported inline in CSS block)
- **Turquoise (#2BBCCA):** NEVER for charts, large backgrounds, or decoration. Only interactive accents.
- **Modals/Overlays:** Must use `z-[9999]`, NOT `z-50` (host app navbar sits above z-50)
- **Disabled states:** Use `--semantic-disabled-*` tokens, not just `opacity-50`
- **Border radius:**
  - `rounded` (4px) for buttons/inputs
  - `rounded-lg` (8px) for cards/modals
- **Colors:** Never hardcoded hex values in Tailwind classes — always use `bg-[var(--semantic-primary)]` format
- **Components:** Each page inlines a `const css = \`...\`` string with full `:root` token block. This duplication is INTENTIONAL per myoperator-design skill.

### 11.3 Component Patterns
- Buttons: `rounded` (4px), proper hover/active states
- Inputs: `rounded` (4px), focus ring with `--semantic-brand`
- Cards: `rounded-lg` (8px), subtle shadow or border
- Tables: Header row with `bg-[var(--semantic-surface)]`, rows with `border-b`
- Modals: `z-[9999]` overlay, centered card `rounded-lg`

---

## 12. Current Page Inventory

| Page | File | Status | Notes |
|------|------|--------|-------|
| Login | `src/pages/LoginPage.jsx` | ✅ Complete | myOperator styled |
| Signup | `src/pages/SignupPage.jsx` | ✅ Complete | myOperator styled |
| Dashboard | `src/pages/Dashboard.jsx` | ✅ Complete | Tasks, Issues, Activity widgets |
| Projects | `src/pages/Projects.jsx` | ✅ Complete | Table view |
| Project Detail | `src/pages/ProjectDetail.jsx` | ✅ Complete | Tabs: Overview, Tasks, Issues |
| Tasks | `src/pages/Tasks.jsx` | ✅ Complete | List view + Kanban board |
| Task Detail | `src/pages/TaskDetail.jsx` | ✅ Complete | Comments, metadata |
| Issues | `src/pages/Issues.jsx` | ✅ Complete | Issue tracker |
| Calendar | `src/pages/Calendar.jsx` | ✅ Complete | Monthly view |
| Time Logs | `src/pages/TimeLogs.jsx` | ✅ Complete | Time tracking table |
| Reports | `src/pages/Reports.jsx` | ✅ Complete | Charts & stats |
| Settings | `src/pages/Settings.jsx` | ✅ Complete | Preferences |

---

## 13. Feature Gap Analysis

### ✅ Implemented (Core MVP)
- [x] Dashboard with stats and widgets
- [x] Project management (CRUD)
- [x] Task management with status/priority/assignee
- [x] Issue/bug tracking
- [x] Calendar view
- [x] Time logging
- [x] Basic reports
- [x] Comments on tasks
- [x] Activity feed
- [x] User profiles (basic)

### ❌ Missing (Jira Reference)
**High Priority:**
- [ ] Subtasks
- [ ] Linked tasks
- [ ] Kanban board drag-and-drop
- [ ] Notifications center
- [ ] Dark mode
- [ ] Search functionality
- [ ] Filters (advanced)
- [ ] Bulk actions on tasks

**Medium Priority:**
- [ ] Workflow automation
- [ ] Custom fields
- [ ] Forms builder
- [ ] Pages/Documents
- [ ] Standups
- [ ] Team management
- [ ] Role-based permissions
- [ ] Export functionality

**Low Priority:**
- [ ] AI filtering
- [ ] Cumulative flow diagrams
- [ ] Program boards
- [ ] Space backgrounds/icons
- [ ] Two-factor auth
- [ ] Email notifications
- [ ] Custom onboarding
- [ ] Gadgets/dashboard customization

---

## 14. Session Context & Decisions

### Session: Apr 28, 2026

**User Requests Completed:**
1. ✅ Saved previous prompts to `prompts.md`
2. ✅ Started dev server (port 5173 → 5174 → back to 5173)
3. ✅ Fixed Dashboard TaskRow vertical stacking bug
4. ✅ Analyzed 4 Jira PM app reference images and extracted full feature tree
5. ✅ Created this comprehensive knowledge base file

**Key Decisions:**
- Keep inline CSS token blocks per page (don't DRY into shared file without user approval)
- Use hash-based routing (not react-router) per project convention
- shadcn/ui Card component has `flex flex-col` default — watch for flex direction conflicts
- Modals must use `z-[9999]` not `z-50`

**Open Questions / Next Steps:**
- Which missing features should be built next? (Subtasks? Notifications? Dark mode?)
- Should we implement the full Jira feature tree or focus on a specific subset?
- Any API/backend integration planned, or keep using demo DataContext?

---

## Appendix A: Reference Image Descriptions

### Image 1 — Jira Feature Tree (Top)
Shows the top portion of a Jira PM app feature catalog from a design reference site. Features visible:
- Onboarding section (Creating a site, Adding a status, Subscribing to a plan)
- Space dashboard section (Creating a task with rich formatting options)
- Task Detail section (comprehensive list of task actions)
- Task management actions (Filtering, Searching, Printing)

### Image 2 — Jira Feature Tree (Middle-Top)
Continuation showing:
- View work items as chart
- Formatting rules, Board insights
- Workflow management (Transitions, Rules)
- Pages & Forms (Creating pages, forms, fields)
- Views (Cumulative flow diagram)
- Space actions (Shortcuts, Teams, Star, Archive)

### Image 3 — Jira Feature Tree (Middle-Bottom)
Continuation showing:
- Planning (Demo plans, Program boards, Dependencies)
- Search & Sidebar customization
- Notifications
- Profile & Teams (Avatar, Team CRUD)
- Space Settings (Members, Roles, Notifications)
- Automation (Rules, Performance)
- Personal settings (Dark mode, Email)

### Image 4 — Jira Feature Tree (Bottom)
Final portion showing:
- Jira System Settings (Gadgets, Fullscreen, Dashboard layout)
- Jira App Settings (Onboarding, Links, Permissions)
- Jira Space Settings (Categories, Restore)
- Jira Work Item Settings (Status names, Filters)
- Account Settings (Visibility, Password, 2FA)
- Auth (Login, Reset password)

---

## Appendix B: Development Commands

```bash
# Start dev server
npm run dev

# Production build
npm run build

# Preview built bundle
npm run preview
```

**Local URL:** http://localhost:5173/

---

*End of Document — TaskPilot Knowledge Base*
