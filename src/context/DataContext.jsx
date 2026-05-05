import { createContext, useContext, useState, useCallback } from 'react'

const now = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return fmt(x)
}
const today = fmt(now)

const demoUsers = [
  { id: 'u1', name: 'John Doe', email: 'john@taskpilot.app', role: 'Admin', avatar: '', status: 'Active' },
  { id: 'u2', name: 'Sarah Miller', email: 'sarah@taskpilot.app', role: 'Manager', avatar: '', status: 'Active' },
  { id: 'u3', name: 'Mike Ross', email: 'mike@taskpilot.app', role: 'Member', avatar: '', status: 'Active' },
  { id: 'u4', name: 'Lisa Kim', email: 'lisa@taskpilot.app', role: 'Member', avatar: '', status: 'Away' },
  { id: 'u5', name: 'Ankish Khatri', email: 'ankish@taskpilot.app', role: 'Manager', avatar: '', status: 'Active' },
  { id: 'u6', name: 'Kunal Nair', email: 'kunal@taskpilot.app', role: 'Member', avatar: '', status: 'Active' },
]

const demoProjects = [
  { id: 'p1', name: 'Website Redesign', description: 'Complete overhaul of the company website with modern design.', status: 'Active', progress: 65, ownerId: 'u1', startDate: addDays(now, -30), endDate: addDays(now, 30), teamMemberIds: ['u1','u2','u3'] },
  { id: 'p2', name: 'Mobile App v2', description: 'Next version of the mobile app with new features.', status: 'Active', progress: 15, ownerId: 'u2', startDate: addDays(now, -10), endDate: addDays(now, 90), teamMemberIds: ['u1','u4'] },
  { id: 'p3', name: 'Dashboard API', description: 'REST API for the new analytics dashboard.', status: 'Active', progress: 80, ownerId: 'u3', startDate: addDays(now, -45), endDate: addDays(now, 15), teamMemberIds: ['u3','u2'] },
  { id: 'p4', name: 'Q3 Planning', description: 'Quarterly planning and roadmap alignment.', status: 'Completed', progress: 100, ownerId: 'u1', startDate: addDays(now, -90), endDate: addDays(now, -10), teamMemberIds: ['u1','u2','u3','u4'] },
  { id: 'p5', name: 'Product Design', description: 'End-to-end product design system and UX audit.', status: 'Active', progress: 66, ownerId: 'u5', startDate: addDays(now, -20), endDate: addDays(now, 40), teamMemberIds: ['u5','u6'] },
]

const LABEL_COLORS = {
  'UX': { bg: '#EEF2FF', text: '#4338CA', border: '#A5B4FC' },
  'Design': { bg: '#FDF4FF', text: '#A21CAF', border: '#E9D5FF' },
  'UI': { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  'Backend': { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'API': { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
  'Mobile': { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
  'Auth': { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  'QA': { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  'Testing': { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  'DevOps': { bg: '#ECFEFF', text: '#0E7490', border: '#A5F3FC' },
  'Planning': { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
}

export function getLabelColor(tag) {
  return LABEL_COLORS[tag] || { bg: '#F3F4F6', text: '#4B5563', border: '#D1D5DB' }
}

const demoTasks = [
  { id: 't1', projectId: 'p5', taskListId: 'tl1', title: 'sign up journey improvement', description: 'Redesign the onboarding flow to improve conversion rates. Focus on reducing friction in the signup process and adding progressive profiling.', status: 'In Progress', priority: 'High', assigneeId: 'u6', dueDate: addDays(now, -9), startDate: addDays(now, -12), duration: 4, completionPercent: 98, tags: ['UX'], timelogTotal: 16, dependencies: ['t8'], flagged: true, archived: false },
  { id: 't2', projectId: 'p1', taskListId: 'tl2', title: 'Design system audit', description: 'Audit current design tokens, components, and patterns across all products. Document inconsistencies and create a remediation plan.', status: 'In Progress', priority: 'High', assigneeId: 'u2', dueDate: addDays(now, -2), startDate: addDays(now, -15), duration: 5, completionPercent: 70, tags: ['Design','UI'], timelogTotal: 12, dependencies: [], flagged: false, archived: false },
  { id: 't3', projectId: 'p3', taskListId: 'tl3', title: 'API integration for charts', description: 'Integrate Chart.js with the dashboard API endpoints. Ensure real-time data updates and responsive chart rendering.', status: 'To Do', priority: 'High', assigneeId: 'u3', dueDate: addDays(now, 2), startDate: addDays(now, -5), duration: 6, completionPercent: 10, tags: ['Backend','API'], timelogTotal: 4, dependencies: ['t5'], flagged: false, archived: false },
  { id: 't4', projectId: 'p2', taskListId: 'tl4', title: 'User authentication flow', description: 'Implement OAuth2 and SAML SSO authentication. Add MFA support and session management.', status: 'In Progress', priority: 'Medium', assigneeId: 'u1', dueDate: addDays(now, 5), startDate: addDays(now, -3), duration: 8, completionPercent: 40, tags: ['Mobile','Auth'], timelogTotal: 8, dependencies: [], flagged: false, archived: false },
  { id: 't5', projectId: 'p3', taskListId: 'tl3', title: 'Write test cases', description: 'Create comprehensive test cases for the new API endpoints. Include unit tests, integration tests, and edge case scenarios.', status: 'To Do', priority: 'Medium', assigneeId: 'u4', dueDate: addDays(now, 8), startDate: addDays(now, -1), duration: 3, completionPercent: 0, tags: ['QA','Testing'], timelogTotal: 0, dependencies: [], flagged: false, archived: false },
  { id: 't6', projectId: 'p1', taskListId: 'tl2', title: 'Deploy to staging', description: 'Set up CI/CD pipeline for automatic staging deployments. Configure environment variables and health checks.', status: 'To Do', priority: 'Low', assigneeId: 'u1', dueDate: addDays(now, 12), startDate: addDays(now, 0), duration: 2, completionPercent: 0, tags: ['DevOps'], timelogTotal: 0, dependencies: ['t2'], flagged: false, archived: false },
  { id: 't7', projectId: 'p4', taskListId: 'tl5', title: 'Client feedback review', description: 'Review and categorize all client feedback from Q2. Create action items and assign to relevant team members.', status: 'Done', priority: 'Low', assigneeId: 'u2', dueDate: addDays(now, -15), startDate: addDays(now, -30), duration: 5, completionPercent: 100, tags: ['Planning'], timelogTotal: 10, dependencies: [], flagged: false, archived: false },
  { id: 't8', projectId: 'p5', taskListId: 'tl1', title: 'Component library setup', description: 'Initialize Storybook and create the base component library. Set up design tokens and theme configuration.', status: 'Done', priority: 'Medium', assigneeId: 'u5', dueDate: addDays(now, -5), startDate: addDays(now, -18), duration: 7, completionPercent: 100, tags: ['Design','UI'], timelogTotal: 20, dependencies: [], flagged: false, archived: false },
]

const demoSubtasks = [
  { id: 'st1', taskId: 't1', title: 'Research competitor onboarding flows', status: 'Done', assigneeId: 'u6' },
  { id: 'st2', taskId: 't1', title: 'Create wireframes for new signup', status: 'Done', assigneeId: 'u6' },
  { id: 'st3', taskId: 't1', title: 'User testing with 5 participants', status: 'In Progress', assigneeId: 'u5' },
  { id: 'st4', taskId: 't1', title: 'Finalize high-fidelity mockups', status: 'To Do', assigneeId: 'u6' },
  { id: 'st5', taskId: 't2', title: 'Inventory all existing components', status: 'Done', assigneeId: 'u2' },
  { id: 'st6', taskId: 't2', title: 'Document color token inconsistencies', status: 'In Progress', assigneeId: 'u2' },
  { id: 'st7', taskId: 't2', title: 'Create remediation roadmap', status: 'To Do', assigneeId: 'u5' },
  { id: 'st8', taskId: 't3', title: 'Set up Chart.js library', status: 'Done', assigneeId: 'u3' },
  { id: 'st9', taskId: 't3', title: 'Connect to analytics API', status: 'To Do', assigneeId: 'u3' },
]

const demoTaskComments = [
  { id: 'tc1', taskId: 't1', userId: 'u5', text: 'The wireframes look great! Let\'s move to user testing.', createdAt: addDays(now, -5) + 'T14:00:00Z' },
  { id: 'tc2', taskId: 't1', userId: 'u6', text: 'Got feedback from 3 users so far. Main issue is the password field visibility.', createdAt: addDays(now, -3) + 'T10:30:00Z' },
  { id: 'tc3', taskId: 't1', userId: 'u5', text: 'Can we add a "show password" toggle?', createdAt: addDays(now, -3) + 'T11:00:00Z' },
  { id: 'tc4', taskId: 't2', userId: 'u2', text: 'Found 12 inconsistent color tokens across the app. Documenting now.', createdAt: addDays(now, -2) + 'T09:00:00Z' },
  { id: 'tc5', taskId: 't3', userId: 'u1', text: 'Make sure to handle the loading states properly.', createdAt: addDays(now, -1) + 'T16:00:00Z' },
]

const demoIssues = [
  { id: 'i1', projectId: 'p1', title: 'Navigation overlap on mobile', status: 'Open', severity: 'High', assigneeId: 'u3', reporterId: 'u2', dueDate: addDays(now, 3), createdAt: addDays(now, -2) },
  { id: 'i2', projectId: 'p3', title: 'API rate limiting not enforced', status: 'In Progress', severity: 'Critical', assigneeId: 'u3', reporterId: 'u1', dueDate: addDays(now, 1), createdAt: addDays(now, -1) },
  { id: 'i3', projectId: 'p2', title: 'Login screen flicker on iOS', status: 'Open', severity: 'Medium', assigneeId: 'u4', reporterId: 'u6', dueDate: addDays(now, 7), createdAt: addDays(now, -3) },
  { id: 'i4', projectId: 'p5', title: 'Color contrast fails WCAG', status: 'Resolved', severity: 'Low', assigneeId: 'u5', reporterId: 'u6', dueDate: addDays(now, -1), createdAt: addDays(now, -5) },
]

const demoPhases = [
  { id: 'ph1', projectId: 'p5', name: 'Discovery', status: 'Completed', ownerId: 'u5', startDate: addDays(now, -20), endDate: addDays(now, -10), progress: 100 },
  { id: 'ph2', projectId: 'p5', name: 'Design', status: 'In Progress', ownerId: 'u5', startDate: addDays(now, -10), endDate: addDays(now, 10), progress: 75 },
  { id: 'ph3', projectId: 'p5', name: 'Development', status: 'Not Started', ownerId: 'u6', startDate: addDays(now, 10), endDate: addDays(now, 30), progress: 0 },
  { id: 'ph4', projectId: 'p1', name: 'Wireframes', status: 'Completed', ownerId: 'u2', startDate: addDays(now, -30), endDate: addDays(now, -15), progress: 100 },
  { id: 'ph5', projectId: 'p1', name: 'Visual Design', status: 'In Progress', ownerId: 'u2', startDate: addDays(now, -15), endDate: addDays(now, 5), progress: 60 },
]

const demoTimeLogs = [
  { id: 'tl1', projectId: 'p5', taskId: 't1', userId: 'u6', title: 'sign up journey improvement', dailyLogHours: 4, date: addDays(now, -2), billingType: 'Billable', notes: 'Refined onboarding screens' },
  { id: 'tl2', projectId: 'p5', taskId: 't1', userId: 'u6', title: 'sign up journey improvement', dailyLogHours: 4, date: addDays(now, -1), billingType: 'Billable', notes: 'Prototype testing' },
  { id: 'tl3', projectId: 'p1', taskId: 't2', userId: 'u2', title: 'Design system audit', dailyLogHours: 3, date: addDays(now, -1), billingType: 'Billable', notes: 'Color token audit' },
  { id: 'tl4', projectId: 'p3', taskId: 't3', userId: 'u3', title: 'API integration for charts', dailyLogHours: 2, date: today, billingType: 'Non-Billable', notes: 'Research chart libraries' },
]

const demoActivities = [
  { id: 'a1', userId: 'u6', action: 'moved task to In Progress', targetType: 'Task', targetId: 't1', targetName: 'sign up journey improvement', timestamp: addDays(now, -1) + 'T10:00:00Z' },
  { id: 'a2', userId: 'u2', action: 'created issue', targetType: 'Issue', targetId: 'i1', targetName: 'Navigation overlap on mobile', timestamp: addDays(now, -2) + 'T09:30:00Z' },
  { id: 'a3', userId: 'u1', action: 'completed task', targetType: 'Task', targetId: 't7', targetName: 'Client feedback review', timestamp: addDays(now, -15) + 'T16:00:00Z' },
  { id: 'a4', userId: 'u5', action: 'created project', targetType: 'Project', targetId: 'p5', targetName: 'Product Design', timestamp: addDays(now, -20) + 'T08:00:00Z' },
  { id: 'a5', userId: 'u3', action: 'logged 2 hours', targetType: 'TimeLog', targetId: 'tl4', targetName: 'API integration for charts', timestamp: today + 'T11:00:00Z' },
]

const demoNotifications = [
  { id: 'n1', userId: 'u6', message: 'You were assigned to task "sign up journey improvement"', read: false, createdAt: addDays(now, -12) + 'T09:00:00Z', link: '/tasks' },
  { id: 'n2', userId: 'u3', message: 'Issue "API rate limiting not enforced" marked Critical', read: false, createdAt: addDays(now, -1) + 'T14:00:00Z', link: '/issues' },
  { id: 'n3', userId: 'u2', message: 'Project "Website Redesign" deadline is in 30 days', read: true, createdAt: addDays(now, -3) + 'T08:00:00Z', link: '/projects' },
]

const DataContext = createContext(null)

let nextId = 100
const uid = (prefix) => `${prefix}${nextId++}`

function calcProjectProgress(projectTasks) {
  if (projectTasks.length === 0) return 0
  const total = projectTasks.reduce((s, t) => s + (t.completionPercent || 0), 0)
  return Math.round(total / projectTasks.length)
}

export function DataProvider({ children }) {
  const [users, setUsers] = useState(demoUsers)
  const [projects, setProjects] = useState(demoProjects)
  const [tasks, setTasks] = useState(demoTasks)
  const [issues, setIssues] = useState(demoIssues)
  const [phases, setPhases] = useState(demoPhases)
  const [timeLogs, setTimeLogs] = useState(demoTimeLogs)
  const [activities, setActivities] = useState(demoActivities)
  const [notifications, setNotifications] = useState(demoNotifications)
  const [subtasks, setSubtasks] = useState(demoSubtasks)
  const [taskComments, setTaskComments] = useState(demoTaskComments)

  const currentUser = users[0]

  const recalcProjectProgress = useCallback((taskList) => {
    setProjects(prev => prev.map(p => {
      const pTasks = taskList.filter(t => t.projectId === p.id)
      const progress = calcProjectProgress(pTasks)
      return { ...p, progress }
    }))
  }, [])

  const addActivity = useCallback((userId, action, targetType, targetId, targetName) => {
    const a = { id: uid('a'), userId, action, targetType, targetId, targetName, timestamp: new Date().toISOString() }
    setActivities(prev => [a, ...prev])
  }, [])

  const addNotification = useCallback((userId, message, link) => {
    const n = { id: uid('n'), userId, message, read: false, createdAt: new Date().toISOString(), link }
    setNotifications(prev => [n, ...prev])
  }, [])

  const createProject = useCallback((data) => {
    const p = { id: uid('p'), ...data, progress: 0, teamMemberIds: data.teamMemberIds || [] }
    setProjects(prev => [...prev, p])
    addActivity(currentUser.id, 'created project', 'Project', p.id, p.name)
    return p
  }, [addActivity, currentUser.id])

  const updateProject = useCallback((id, data) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }, [])

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    setTasks(prev => prev.filter(t => t.projectId !== id))
    setIssues(prev => prev.filter(i => i.projectId !== id))
    setPhases(prev => prev.filter(ph => ph.projectId !== id))
    setTimeLogs(prev => prev.filter(tl => tl.projectId !== id))
  }, [])

  const createTask = useCallback((data) => {
    const t = { id: uid('t'), ...data, completionPercent: data.completionPercent ?? 0, tags: data.tags || [] }
    setTasks(prev => {
      const next = [...prev, t]
      recalcProjectProgress(next)
      return next
    })
    addActivity(currentUser.id, 'created task', 'Task', t.id, t.title)
    if (t.assigneeId && t.assigneeId !== currentUser.id) {
      addNotification(t.assigneeId, `You were assigned to task "${t.title}"`, '/tasks')
    }
    return t
  }, [addActivity, addNotification, currentUser.id, recalcProjectProgress])

  const updateTask = useCallback((id, data) => {
    setTasks(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...data } : t)
      recalcProjectProgress(next)
      return next
    })
  }, [recalcProjectProgress])

  const deleteTask = useCallback((id) => {
    setTasks(prev => {
      const next = prev.filter(t => t.id !== id)
      recalcProjectProgress(next)
      return next
    })
  }, [recalcProjectProgress])

  const duplicateTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const duplicated = {
      ...task,
      id: uid('t'),
      title: `${task.title} (Copy)`,
      status: 'To Do',
      completionPercent: 0,
      timelogTotal: 0,
      startDate: today,
      dueDate: '',
      dependencies: [],
      flagged: false,
      archived: false,
    }
    setTasks(prev => {
      const next = [...prev, duplicated]
      recalcProjectProgress(next)
      return next
    })
    addActivity(currentUser.id, 'duplicated task', 'Task', duplicated.id, duplicated.title)
    return duplicated
  }, [tasks, recalcProjectProgress, addActivity, currentUser.id])

  const archiveTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, archived: true } : t))
    addActivity(currentUser.id, 'archived task', 'Task', id, tasks.find(t => t.id === id)?.title)
  }, [tasks, addActivity, currentUser.id])

  const unarchiveTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, archived: false } : t))
    addActivity(currentUser.id, 'unarchived task', 'Task', id, tasks.find(t => t.id === id)?.title)
  }, [tasks, addActivity, currentUser.id])

  const toggleTaskFlag = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, flagged: !t.flagged } : t))
  }, [])

  const addTaskDependency = useCallback((taskId, dependencyId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      const deps = t.dependencies || []
      if (deps.includes(dependencyId)) return t
      return { ...t, dependencies: [...deps, dependencyId] }
    }))
  }, [])

  const removeTaskDependency = useCallback((taskId, dependencyId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      const deps = t.dependencies || []
      return { ...t, dependencies: deps.filter(d => d !== dependencyId) }
    }))
  }, [])

  const createIssue = useCallback((data) => {
    const i = { id: uid('i'), ...data, createdAt: new Date().toISOString() }
    setIssues(prev => [...prev, i])
    addActivity(currentUser.id, 'created issue', 'Issue', i.id, i.title)
    if (i.assigneeId && i.assigneeId !== currentUser.id) {
      addNotification(i.assigneeId, `You were assigned to issue "${i.title}"`, '/issues')
    }
    return i
  }, [addActivity, addNotification, currentUser.id])

  const updateIssue = useCallback((id, data) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, ...data } : i))
  }, [])

  const deleteIssue = useCallback((id) => {
    setIssues(prev => prev.filter(i => i.id !== id))
  }, [])

  const createPhase = useCallback((data) => {
    const ph = { id: uid('ph'), ...data, progress: data.progress ?? 0 }
    setPhases(prev => [...prev, ph])
    addActivity(currentUser.id, 'created phase', 'Phase', ph.id, ph.name)
    return ph
  }, [addActivity, currentUser.id])

  const updatePhase = useCallback((id, data) => {
    setPhases(prev => prev.map(ph => ph.id === id ? { ...ph, ...data } : ph))
  }, [])

  const deletePhase = useCallback((id) => {
    setPhases(prev => prev.filter(ph => ph.id !== id))
  }, [])

  const createTimeLog = useCallback((data) => {
    const tl = { id: uid('tl'), ...data, date: data.date || today }
    setTimeLogs(prev => [...prev, tl])
    addActivity(currentUser.id, 'logged time', 'TimeLog', tl.id, tl.title)
    return tl
  }, [addActivity, currentUser.id])

  const updateTimeLog = useCallback((id, data) => {
    setTimeLogs(prev => prev.map(tl => tl.id === id ? { ...tl, ...data } : tl))
  }, [])

  const deleteTimeLog = useCallback((id) => {
    setTimeLogs(prev => prev.filter(tl => tl.id !== id))
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const inviteUser = useCallback((data) => {
    const u = { id: uid('u'), ...data, status: 'Active' }
    setUsers(prev => [...prev, u])
    addActivity(currentUser.id, 'invited user', 'User', u.id, u.name)
    return u
  }, [addActivity, currentUser.id])

  const updateUser = useCallback((id, data) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u))
  }, [])

  const updateUserRole = useCallback((id, role) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
  }, [])

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }, [])

  const searchAll = useCallback((query) => {
    const q = query.toLowerCase()
    const res = []
    projects.filter(p => p.name.toLowerCase().includes(q)).forEach(p => res.push({ type: 'Project', id: p.id, name: p.name, link: `/projects/${p.id}` }))
    tasks.filter(t => t.title.toLowerCase().includes(q)).forEach(t => res.push({ type: 'Task', id: t.id, name: t.title, link: `/tasks/${t.id}` }))
    issues.filter(i => i.title.toLowerCase().includes(q)).forEach(i => res.push({ type: 'Issue', id: i.id, name: i.title, link: `/issues` }))
    return res.slice(0, 8)
  }, [projects, tasks, issues])

  const getSubtasks = useCallback((taskId) => subtasks.filter(st => st.taskId === taskId), [subtasks])
  const getTaskComments = useCallback((taskId) => taskComments.filter(tc => tc.taskId === taskId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), [taskComments])

  const createSubtask = useCallback((data) => {
    const st = { id: uid('st'), ...data }
    setSubtasks(prev => [...prev, st])
    addActivity(currentUser.id, 'added subtask', 'Subtask', st.id, st.title)
    return st
  }, [addActivity, currentUser.id])

  const updateSubtask = useCallback((id, data) => {
    setSubtasks(prev => prev.map(st => st.id === id ? { ...st, ...data } : st))
  }, [])

  const deleteSubtask = useCallback((id) => {
    setSubtasks(prev => prev.filter(st => st.id !== id))
  }, [])

  const createTaskComment = useCallback((data) => {
    const tc = { id: uid('tc'), ...data, createdAt: new Date().toISOString() }
    setTaskComments(prev => [...prev, tc])
    return tc
  }, [])

  const deleteTaskComment = useCallback((id) => {
    setTaskComments(prev => prev.filter(tc => tc.id !== id))
  }, [])

  const value = {
    users, projects, tasks, issues, phases, timeLogs, activities, notifications, currentUser, subtasks, taskComments,
    createProject, updateProject, deleteProject,
    createTask, updateTask, deleteTask, duplicateTask, archiveTask, unarchiveTask, toggleTaskFlag,
    addTaskDependency, removeTaskDependency,
    createIssue, updateIssue, deleteIssue,
    createPhase, updatePhase, deletePhase,
    createTimeLog, updateTimeLog, deleteTimeLog,
    markNotificationRead, markAllNotificationsRead,
    inviteUser, updateUser, updateUserRole, deleteUser,
    searchAll,
    getSubtasks, getTaskComments,
    createSubtask, updateSubtask, deleteSubtask,
    createTaskComment, deleteTaskComment,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
