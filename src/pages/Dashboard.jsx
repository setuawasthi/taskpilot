import { useNavigate } from 'react-router-dom'
import { useData, getLabelColor } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  FolderKanban, CheckSquare, AlertCircle, Clock,
  CheckCircle2, TrendingUp, Calendar, ArrowRight,
  ChevronDown, Flame, Flag, Zap, LayoutList,
  BarChart3, Users, Settings, PlayCircle,
} from 'lucide-react'
import { useState } from 'react'

/* ─── helpers ─── */
const priorityMeta = {
  Urgent: { color: 'text-[var(--color-mo-error-primary)]',   bg: 'bg-[var(--color-mo-error-surface)]',   border: 'border-[var(--color-mo-error-border)]', icon: Flame },
  High:   { color: 'text-[var(--color-mo-warning-primary)]', bg: 'bg-[var(--color-mo-warning-surface)]', border: 'border-[var(--color-mo-warning-border)]', icon: Flag },
  Medium: { color: 'text-[#CA8A04]',                       bg: 'bg-[#FEFCE8]',                       border: 'border-[#FDE68A]', icon: Flag },
  Low:    { color: 'text-[var(--color-mo-text-muted)]',    bg: 'bg-[var(--color-mo-bg-ui)]',           border: 'border-[var(--color-mo-border-layout)]', icon: Flag },
}

function PriorityDot({ priority }) {
  const p = priorityMeta[priority] || priorityMeta.Low
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border', p.bg, p.color, p.border)}>
      <p.icon className="w-2.5 h-2.5" />
      {priority}
    </span>
  )
}

function StatusBadge({ status }) {
  const map = {
    'To Do':       { dot: 'bg-[var(--color-mo-text-placeholder)]', bg: 'bg-[var(--color-mo-bg-ui)]',           text: 'text-[var(--color-mo-text-muted)]',    border: 'border-[var(--color-mo-border-layout)]' },
    'In Progress': { dot: 'bg-[var(--color-mo-brand)]',            bg: 'bg-[var(--color-mo-brand-surface)]',    text: 'text-[var(--color-mo-brand)]',         border: 'border-[var(--color-mo-brand)]/20' },
    'Done':        { dot: 'bg-[var(--color-mo-success-primary)]',  bg: 'bg-[var(--color-mo-success-surface)]',  text: 'text-[var(--color-mo-success-primary)]', border: 'border-[var(--color-mo-success-border)]' },
    'Open':        { dot: 'bg-[var(--color-mo-error-primary)]',    bg: 'bg-[var(--color-mo-error-surface)]',    text: 'text-[var(--color-mo-error-primary)]',   border: 'border-[var(--color-mo-error-border)]' },
    'Closed':      { dot: 'bg-[var(--color-mo-success-primary)]',  bg: 'bg-[var(--color-mo-success-surface)]',  text: 'text-[var(--color-mo-success-primary)]', border: 'border-[var(--color-mo-success-border)]' },
    'Resolved':    { dot: 'bg-[var(--color-mo-success-primary)]',  bg: 'bg-[var(--color-mo-success-surface)]',  text: 'text-[var(--color-mo-success-primary)]', border: 'border-[var(--color-mo-success-border)]' },
  }
  const s = map[status] || map['To Do']
  return (
    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border', s.bg, s.text, s.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {status}
    </span>
  )
}

/* ─── Compact Stat Item ─── */
function StatItem({ label, value, icon: Icon, color, onClick }) {
  const c = {
    blue:  'bg-[var(--color-mo-info-surface)] text-[var(--color-mo-info-primary)]',
    green: 'bg-[var(--color-mo-success-surface)] text-[var(--color-mo-success-primary)]',
    red:   'bg-[var(--color-mo-error-surface)] text-[var(--color-mo-error-primary)]',
    gray:  'bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-muted)]',
  }[color] || c.gray

  return (
    <button onClick={onClick} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-[var(--color-mo-border-layout)] hover:border-[var(--color-mo-border-input)] hover:shadow-sm transition-all text-left min-w-0">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', c)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">{label}</p>
        <p className="text-[20px] font-bold text-[var(--color-mo-text-primary)] leading-tight">{value}</p>
      </div>
    </button>
  )
}

/* ─── Project Card (strokeless, shadow-based) ─── */
function ProjectCard({ project, users, tasks, onClick }) {
  const owner = users.find(u => u.id === project.ownerId)
  const team = users.filter(u => project.teamMemberIds?.includes(u.id)).slice(0, 3)
  const projectTaskCount = tasks.filter(t => t.projectId === project.id && !t.archived).length
  const projectDoneCount = tasks.filter(t => t.projectId === project.id && t.status === 'Done').length

  const progressColor = project.progress >= 80 ? 'var(--color-mo-success-primary)' : project.progress >= 40 ? 'var(--color-mo-brand)' : 'var(--color-mo-warning-primary)'
  const progressBg = project.progress >= 80 ? 'var(--color-mo-success-surface)' : project.progress >= 40 ? 'var(--color-mo-brand-surface)' : 'var(--color-mo-warning-surface)'

  return (
    <Card
      onClick={onClick}
      className="group relative flex flex-col rounded-lg border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: progressColor }} />

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: progressBg, color: progressColor }}>
              <FolderKanban className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-[var(--color-mo-text-primary)] truncate group-hover:text-[var(--color-mo-brand)] transition-colors">
                {project.name}
              </h3>
              <p className="text-[11px] text-[var(--color-mo-text-muted)] truncate">{owner?.name || 'No owner'}</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 shrink-0',
              project.status === 'Active'
                ? 'bg-[var(--color-mo-info-surface)] text-[var(--color-mo-info-text)]'
                : project.status === 'Completed'
                  ? 'bg-[var(--color-mo-success-surface)] text-[var(--color-mo-success-text)]'
                  : 'bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-muted)]'
            )}
          >
            {project.status}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-[var(--color-mo-text-muted)] font-medium">{projectDoneCount}/{projectTaskCount} tasks</span>
            <span className="font-bold text-[var(--color-mo-text-primary)]">{project.progress}%</span>
          </div>
          <div className="h-2 w-full bg-[var(--color-mo-bg-ui)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%`, backgroundColor: progressColor }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--color-mo-border-layout)]">
          <div className="flex items-center gap-1.5">
            {project.endDate ? (
              <span className="text-[11px] text-[var(--color-mo-text-muted)] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            ) : (
              <span className="text-[11px] text-[var(--color-mo-text-placeholder)]">No deadline</span>
            )}
          </div>
          <div className="flex items-center">
            {team.map((m, i) => (
              <Avatar key={m.id} className={cn('w-5 h-5 border-2 border-white', i > 0 && '-ml-1.5')}>
                <AvatarFallback className="text-[7px] bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-secondary)] font-medium">
                  {m.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.teamMemberIds?.length > 3 && (
              <span className="w-5 h-5 rounded-full bg-[var(--color-mo-bg-ui)] text-[7px] font-medium text-[var(--color-mo-text-secondary)] flex items-center justify-center -ml-1.5 border-2 border-white">
                +{project.teamMemberIds.length - 3}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Task Row ─── */
function TaskRow({ task, project, users, navigate }) {
  const assignee = users.find(u => u.id === task.assigneeId)
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done'

  return (
    <div
      onClick={() => navigate(`/tasks/${task.id}`)}
      className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-mo-bg-ui)] transition-colors cursor-pointer"
    >
      <div className="shrink-0 w-5 flex justify-center">
        {task.status === 'Done' ? (
          <CheckCircle2 className="w-4 h-4 text-[var(--color-mo-success-primary)]" />
        ) : task.status === 'In Progress' ? (
          <div className="w-4 h-4 rounded-full border-2 border-[var(--color-mo-brand)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-mo-brand)]" />
          </div>
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-[var(--color-mo-border-input)] group-hover:border-[var(--color-mo-text-placeholder)] transition-colors" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={cn('text-[13px] block truncate', task.status === 'Done' ? 'line-through text-[var(--color-mo-text-muted)]' : 'text-[var(--color-mo-text-primary)]')}>
          {task.title}
        </span>
        {project && <span className="text-[11px] text-[var(--color-mo-text-muted)]">{project.name}</span>}
      </div>
      <div className="hidden md:flex gap-1.5 shrink-0">
        {task.tags?.slice(0, 2).map(tag => {
          const color = getLabelColor(tag)
          return (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded font-medium border truncate max-w-[70px]"
              style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}>
              {tag}
            </span>
          )
        })}
      </div>
      <div className="hidden sm:block shrink-0">
        <PriorityDot priority={task.priority} />
      </div>
      <div className="hidden lg:flex shrink-0 w-7 justify-center">
        <Avatar className="w-6 h-6">
          <AvatarFallback className="text-[9px] bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-secondary)] font-medium">
            {assignee?.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="hidden sm:block shrink-0 w-[60px] text-right">
        <span className={cn('text-[11px]', isOverdue ? 'text-[var(--color-mo-error-primary)] font-semibold' : 'text-[var(--color-mo-text-placeholder)]')}>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
        </span>
      </div>
    </div>
  )
}

/* ─── Collapsible Task Group ─── */
function TaskGroup({ title, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-0.5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full py-1.5 px-2 hover:bg-[var(--color-mo-bg-ui)] rounded-md transition-colors text-left"
      >
        <ChevronDown className={cn('w-3.5 h-3.5 text-[var(--color-mo-text-placeholder)] transition-transform duration-150', !open && '-rotate-90')} />
        <span className="text-[11px] font-semibold text-[var(--color-mo-text-secondary)] uppercase tracking-wider">{title}</span>
        <span className="text-[11px] text-[var(--color-mo-text-muted)] ml-1">{count}</span>
      </button>
      {open && <div className="space-y-px">{children}</div>}
    </div>
  )
}

/* ─── Issue Row ─── */
function IssueRow({ issue, users, navigate }) {
  const assignee = users.find(u => u.id === issue.assigneeId)
  const sev = {
    Critical: { dot: 'bg-[var(--color-mo-error-primary)]', text: 'text-[var(--color-mo-error-text)]' },
    High:     { dot: 'bg-[var(--color-mo-warning-primary)]', text: 'text-[var(--color-mo-warning-text)]' },
    Medium:   { dot: 'bg-[#CA8A04]', text: 'text-[#A16207]' },
    Low:      { dot: 'bg-[var(--color-mo-text-placeholder)]', text: 'text-[var(--color-mo-text-muted)]' },
  }[issue.severity] || { dot: 'bg-[var(--color-mo-text-placeholder)]', text: 'text-[var(--color-mo-text-muted)]' }

  return (
    <div
      onClick={() => navigate('/issues')}
      className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-[var(--color-mo-bg-ui)] transition-colors cursor-pointer"
    >
      <div className={cn('w-2 h-2 rounded-full mt-1 shrink-0', sev.dot)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-[var(--color-mo-text-primary)] truncate">{issue.title}</span>
          <StatusBadge status={issue.status} />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={cn('text-[10px] font-medium', sev.text)}>{issue.severity}</span>
          <span className="text-[var(--color-mo-border-layout)]">·</span>
          <span className="text-[10px] text-[var(--color-mo-text-muted)]">
            {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
          </span>
          {assignee && (
            <>
              <span className="text-[var(--color-mo-border-layout)]">·</span>
              <Avatar className="w-3.5 h-3.5">
                <AvatarFallback className="text-[6px] bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-secondary)]">
                  {assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Agenda Item ─── */
function AgendaItem({ task, navigate }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done'
  return (
    <div
      onClick={() => navigate(`/tasks/${task.id}`)}
      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--color-mo-bg-ui)] transition-colors cursor-pointer group"
    >
      {task.status === 'Done' ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-mo-success-primary)] shrink-0" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--color-mo-border-input)] group-hover:border-[var(--color-mo-brand)] transition-colors shrink-0" />
      )}
      <span className={cn('text-[12px] flex-1 truncate', task.status === 'Done' ? 'line-through text-[var(--color-mo-text-muted)]' : 'text-[var(--color-mo-text-primary)]')}>
        {task.title}
      </span>
      <span className={cn('text-[10px] shrink-0', isOverdue ? 'text-[var(--color-mo-error-primary)] font-semibold' : 'text-[var(--color-mo-text-placeholder)]')}>
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
      </span>
    </div>
  )
}

/* ─── Activity Item ─── */
function ActivityItem({ activity, users }) {
  const u = users.find(user => user.id === activity.userId)
  const timeAgo = (() => {
    const diff = Date.now() - new Date(activity.timestamp).getTime()
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor(diff / 3600000)
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  })()

  let Icon = Zap
  if (activity.targetType === 'Task') Icon = CheckSquare
  if (activity.targetType === 'Issue') Icon = AlertCircle
  if (activity.targetType === 'Project') Icon = FolderKanban
  if (activity.targetType === 'TimeLog') Icon = Clock

  return (
    <div className="flex gap-2.5 py-1.5">
      <div className="relative flex flex-col items-center">
        <Avatar className="w-6 h-6 shrink-0">
          <AvatarFallback className="text-[8px] bg-[var(--color-mo-brand-surface)] text-[var(--color-mo-brand)] font-semibold">
            {u?.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="w-px flex-1 bg-[var(--color-mo-border-layout)] my-0.5 min-h-[12px]" />
      </div>
      <div className="flex-1 min-w-0 pb-1">
        <p className="text-[11px] leading-snug text-[var(--color-mo-text-secondary)]">
          <span className="font-semibold text-[var(--color-mo-text-primary)]">{u?.name}</span>{' '}
          <span>{activity.action}</span>{' '}
          <span className="text-[var(--color-mo-brand)] font-medium cursor-pointer hover:underline">{activity.targetName}</span>
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Icon className="w-2.5 h-2.5 text-[var(--color-mo-text-placeholder)]" />
          <span className="text-[10px] text-[var(--color-mo-text-placeholder)]">{timeAgo}</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Shortcut Pill ─── */
function ShortcutPill({ label, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-mo-border-layout)] bg-white text-[11px] font-medium text-[var(--color-mo-text-secondary)] hover:border-[var(--color-mo-border-input)] hover:bg-[var(--color-mo-bg-ui)] hover:text-[var(--color-mo-text-primary)] transition-all"
    >
      <Icon className="w-3 h-3 text-[var(--color-mo-text-muted)]" />
      {label}
    </button>
  )
}

/* ─── Workload Mini Bar ─── */
function WorkloadBar({ user, load }) {
  const c = load > 6 ? 'bg-[var(--color-mo-error-primary)]' : load > 3 ? 'bg-[var(--color-mo-warning-primary)]' : 'bg-[var(--color-mo-success-primary)]'
  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-5 h-5 shrink-0">
        <AvatarFallback className="text-[8px] bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-secondary)] font-medium">
          {user.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-[var(--color-mo-text-primary)] truncate">{user.name.split(' ')[0]}</span>
          <span className="text-[10px] text-[var(--color-mo-text-muted)]">{load} tasks</span>
        </div>
        <div className="mt-0.5 h-1 w-full bg-[var(--color-mo-bg-ui)] rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full', c)} style={{ width: `${Math.min((load / 8) * 100, 100)}%` }} />
        </div>
      </div>
    </div>
  )
}

/* ─── Main Dashboard ─── */
export default function Dashboard() {
  const { currentUser, projects, tasks, issues, timeLogs, activities, users } = useData()
  const navigate = useNavigate()
  const [workTab, setWorkTab] = useState('todo')

  const activeTasks = tasks.filter(t => !t.archived)
  const overdueTasks = activeTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done')
  const todayTasks = activeTasks.filter(t => {
    if (!t.dueDate || t.status === 'Done') return false
    const d = new Date(t.dueDate)
    const n = new Date()
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
  })
  const upcomingTasks = activeTasks.filter(t => t.dueDate && new Date(t.dueDate) > new Date() && t.status !== 'Done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  const myLogs = timeLogs.filter(tl => tl.userId === currentUser.id)
  const myLogsThisWeek = myLogs.reduce((sum, tl) => sum + (tl.dailyLogHours || 0), 0)
  const openIssues = issues.filter(i => i.status !== 'Closed' && i.status !== 'Resolved')
  const activeProjects = projects.filter(p => p.status === 'Active').sort((a, b) => b.progress - a.progress)

  const greeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const doneCount = activeTasks.filter(t => t.status === 'Done').length
  const completionRate = activeTasks.length > 0 ? Math.round((doneCount / activeTasks.length) * 100) : 0

  const getProject = (id) => projects.find(p => p.id === id)

  const todoTasks = activeTasks.filter(t => t.status !== 'Done' && t.status !== 'In Progress')
  const inProgressTasks = activeTasks.filter(t => t.status === 'In Progress')
  const doneTasks = activeTasks.filter(t => t.status === 'Done')

  /* workload per user (active tasks count) */
  const userWorkload = users
    .map(u => ({ user: u, load: activeTasks.filter(t => t.status !== 'Done' && t.assigneeId === u.id).length }))
    .filter(w => w.load > 0)
    .sort((a, b) => b.load - a.load)
    .slice(0, 4)

  return (
    <div className="px-5 lg:px-8 py-5 max-w-[1400px] mx-auto">
      <div className="space-y-4">
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">{todayStr}</span>
            <h1 className="text-[22px] font-bold text-[var(--color-mo-text-primary)] tracking-tight">
              Good {greeting}, {currentUser.name.split(' ')[0]} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-[11px] border-[var(--color-mo-border-layout)] hover:bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-secondary)]" onClick={() => navigate('/calendar')}>
              <Calendar className="w-3 h-3 mr-1 text-[var(--color-mo-text-muted)]" />
              Calendar
            </Button>
            <Button size="sm" className="h-8 text-[11px] bg-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-hover)] text-white shadow-none" onClick={() => navigate('/tasks')}>
              <CheckSquare className="w-3 h-3 mr-1" />
              New Task
            </Button>
          </div>
        </div>

        {/* ─── Shortcut Pills ─── */}
        <div className="flex flex-wrap items-center gap-2">
          <ShortcutPill label="Projects" icon={FolderKanban} onClick={() => navigate('/projects')} />
          <ShortcutPill label="Reports" icon={BarChart3} onClick={() => navigate('/reports')} />
          <ShortcutPill label="Team" icon={Users} onClick={() => navigate('/team')} />
          <ShortcutPill label="Settings" icon={Settings} onClick={() => navigate('/settings')} />
          <div className="flex-1" />
          <span className="text-[11px] text-[var(--color-mo-text-muted)]">{completionRate}% sprint completion</span>
        </div>

        {/* ─── Stats Row (compact horizontal) ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatItem label="Open Tasks" value={activeTasks.filter(t => t.status !== 'Done').length} icon={CheckSquare} color="blue" onClick={() => navigate('/tasks')} />
          <StatItem label="Completed" value={doneCount} icon={CheckCircle2} color="green" onClick={() => navigate('/tasks')} />
          <StatItem label="Overdue" value={overdueTasks.length} icon={Clock} color="red" onClick={() => navigate('/tasks')} />
          <StatItem label="Hours" value={myLogsThisWeek + 'h'} icon={TrendingUp} color="gray" onClick={() => navigate('/timelogs')} />
        </div>

        {/* ─── Active Projects (card grid) ─── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-[var(--color-mo-text-primary)] flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[var(--color-mo-brand)]" />
              Active Projects
            </h2>
            <Button variant="ghost" size="sm" className="text-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-surface)] h-7 text-[11px] font-medium" onClick={() => navigate('/projects')}>
              View all <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeProjects.slice(0, 4).map(project => (
              <ProjectCard key={project.id} project={project} users={users} tasks={tasks} onClick={() => navigate(`/projects/${project.id}`)} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* ─── Left Column ─── */}
          <div className="xl:col-span-2 space-y-5">
            {/* My Work */}
            <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white overflow-hidden">
              <CardHeader className="pb-0 px-5 pt-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[14px] font-semibold text-[var(--color-mo-text-primary)] flex items-center gap-2">
                    <LayoutList className="w-4 h-4 text-[var(--color-mo-brand)]" />
                    My Work
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-surface)] h-7 text-[11px] font-medium" onClick={() => navigate('/tasks')}>
                    View all <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-3 px-0">
                <Tabs value={workTab} onValueChange={setWorkTab}>
                  <div className="px-5 pb-2">
                    <TabsList className="h-7 bg-[var(--color-mo-bg-ui)]">
                      <TabsTrigger value="todo" className="text-[11px] px-2.5">
                        To Do <span className="ml-1 text-[10px] text-[var(--color-mo-text-muted)]">{todoTasks.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="inprogress" className="text-[11px] px-2.5">
                        In Progress <span className="ml-1 text-[10px] text-[var(--color-mo-text-muted)]">{inProgressTasks.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="done" className="text-[11px] px-2.5">
                        Done <span className="ml-1 text-[10px] text-[var(--color-mo-text-muted)]">{doneTasks.length}</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="todo" className="mt-0">
                    <div className="px-2">
                      <TaskGroup title="Today" count={todayTasks.length} defaultOpen={true}>
                        {todayTasks.length === 0 ? (
                          <p className="text-[12px] text-[var(--color-mo-text-placeholder)] py-2 px-8">Nothing due today</p>
                        ) : (
                          todayTasks.map(task => <TaskRow key={task.id} task={task} project={getProject(task.projectId)} users={users} navigate={navigate} />)
                        )}
                      </TaskGroup>
                      <TaskGroup title="Overdue" count={overdueTasks.length} defaultOpen={overdueTasks.length > 0}>
                        {overdueTasks.length === 0 ? (
                          <p className="text-[12px] text-[var(--color-mo-text-placeholder)] py-2 px-8">No overdue tasks</p>
                        ) : (
                          overdueTasks.slice(0, 5).map(task => <TaskRow key={task.id} task={task} project={getProject(task.projectId)} users={users} navigate={navigate} />)
                        )}
                      </TaskGroup>
                      <TaskGroup title="Upcoming" count={upcomingTasks.length} defaultOpen={true}>
                        {upcomingTasks.length === 0 ? (
                          <p className="text-[12px] text-[var(--color-mo-text-placeholder)] py-2 px-8">No upcoming tasks</p>
                        ) : (
                          upcomingTasks.slice(0, 5).map(task => <TaskRow key={task.id} task={task} project={getProject(task.projectId)} users={users} navigate={navigate} />)
                        )}
                      </TaskGroup>
                    </div>
                  </TabsContent>

                  <TabsContent value="inprogress" className="mt-0">
                    <div className="px-2">
                      {inProgressTasks.length === 0 ? (
                        <div className="text-center py-8">
                          <PlayCircle className="w-8 h-8 text-[var(--color-mo-border-layout)] mx-auto mb-2" />
                          <p className="text-[12px] text-[var(--color-mo-text-muted)] font-medium">No tasks in progress</p>
                        </div>
                      ) : (
                        inProgressTasks.map(task => <TaskRow key={task.id} task={task} project={getProject(task.projectId)} users={users} navigate={navigate} />)
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="done" className="mt-0">
                    <div className="px-2">
                      {doneTasks.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle2 className="w-8 h-8 text-[var(--color-mo-border-layout)] mx-auto mb-2" />
                          <p className="text-[12px] text-[var(--color-mo-text-muted)] font-medium">No completed tasks yet</p>
                        </div>
                      ) : (
                        doneTasks.slice(0, 8).map(task => <TaskRow key={task.id} task={task} project={getProject(task.projectId)} users={users} navigate={navigate} />)
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Mobile Activity */}
            <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white xl:hidden">
              <CardHeader className="pb-2 flex flex-row items-center gap-2 border-b border-[var(--color-mo-border-layout)] px-5 py-2.5">
                <Zap className="w-3.5 h-3.5 text-[var(--color-mo-brand)]" />
                <CardTitle className="text-[12px] font-semibold text-[var(--color-mo-text-primary)]">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-4">
                <div className="space-y-0">
                  {activities.slice(0, 6).map(a => <ActivityItem key={a.id} activity={a} users={users} />)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Right Column ─── */}
          <div className="space-y-4">
            {/* Today Agenda */}
            <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
              <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-[var(--color-mo-border-layout)] px-4 py-2.5">
                <CardTitle className="text-[12px] font-semibold text-[var(--color-mo-text-primary)] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[var(--color-mo-brand)]" />
                  Today
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 bg-[var(--color-mo-brand-surface)] text-[var(--color-mo-brand)] border-none">
                    {todayTasks.length + overdueTasks.length}
                  </Badge>
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-surface)] h-6 text-[11px] font-medium px-2" onClick={() => navigate('/calendar')}>
                  Agenda
                </Button>
              </CardHeader>
              <CardContent className="pt-2 px-2">
                {todayTasks.length === 0 && overdueTasks.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-8 h-8 text-[var(--color-mo-border-layout)] mx-auto mb-1.5" />
                    <p className="text-[12px] text-[var(--color-mo-text-muted)] font-medium">All caught up</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--color-mo-border-layout)]">
                    {overdueTasks.slice(0, 2).map(task => <AgendaItem key={task.id} task={task} navigate={navigate} />)}
                    {todayTasks.slice(0, 4).map(task => <AgendaItem key={task.id} task={task} navigate={navigate} />)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Issues */}
            <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
              <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-[var(--color-mo-border-layout)] px-4 py-2.5">
                <CardTitle className="text-[12px] font-semibold text-[var(--color-mo-text-primary)] flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-[var(--color-mo-error-primary)]" />
                  Issues
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 bg-[var(--color-mo-error-surface)] text-[var(--color-mo-error-text)] border-none">
                    {openIssues.length}
                  </Badge>
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-surface)] h-6 text-[11px] font-medium px-2" onClick={() => navigate('/issues')}>
                  View all
                </Button>
              </CardHeader>
              <CardContent className="pt-1 px-1">
                {openIssues.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-8 h-8 text-[var(--color-mo-border-layout)] mx-auto mb-1.5" />
                    <p className="text-[12px] text-[var(--color-mo-text-muted)] font-medium">All clear</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--color-mo-border-layout)]">
                    {openIssues.slice(0, 4).map(issue => <IssueRow key={issue.id} issue={issue} users={users} navigate={navigate} />)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity */}
            <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white hidden xl:block">
              <CardHeader className="pb-2 flex flex-row items-center gap-2 border-b border-[var(--color-mo-border-layout)] px-4 py-2.5">
                <Zap className="w-3.5 h-3.5 text-[var(--color-mo-brand)]" />
                <CardTitle className="text-[12px] font-semibold text-[var(--color-mo-text-primary)]">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-4">
                <ScrollArea className="h-[240px]">
                  <div className="space-y-0">
                    {activities.slice(0, 8).map(a => <ActivityItem key={a.id} activity={a} users={users} />)}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Team Workload */}
            <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
              <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-[var(--color-mo-border-layout)] px-4 py-2.5">
                <CardTitle className="text-[12px] font-semibold text-[var(--color-mo-text-primary)] flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[var(--color-mo-brand)]" />
                  Team Workload
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-surface)] h-6 text-[11px] font-medium px-2" onClick={() => navigate('/team')}>
                  View all
                </Button>
              </CardHeader>
              <CardContent className="pt-3 px-4 pb-3">
                {userWorkload.length === 0 ? (
                  <p className="text-[11px] text-[var(--color-mo-text-muted)] text-center py-2">No active assignments</p>
                ) : (
                  <div className="space-y-2.5">
                    {userWorkload.map(({ user, load }) => (
                      <WorkloadBar key={user.id} user={user} load={load} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
