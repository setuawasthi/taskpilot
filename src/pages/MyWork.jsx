import { useNavigate } from 'react-router-dom'
import { useData, getLabelColor } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Circle,
  TrendingUp,
  ArrowRight,
  Flame,
} from 'lucide-react'

const today = new Date().toISOString().split('T')[0]

function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    blue: { bg: 'bg-[var(--color-mo-info-surface)]', text: 'text-[var(--color-mo-info-text)]', icon: 'text-[var(--color-mo-info-primary)]', border: 'border-[var(--color-mo-info-border)]' },
    green: { bg: 'bg-[var(--color-mo-success-surface)]', text: 'text-[var(--color-mo-success-text)]', icon: 'text-[var(--color-mo-success-primary)]', border: 'border-[var(--color-mo-success-border)]' },
    red: { bg: 'bg-[var(--color-mo-error-surface)]', text: 'text-[var(--color-mo-error-text)]', icon: 'text-[var(--color-mo-error-primary)]', border: 'border-[var(--color-mo-error-border)]' },
    gray: { bg: 'bg-[var(--color-mo-bg-ui)]', text: 'text-[var(--color-mo-text-secondary)]', icon: 'text-[var(--color-mo-text-muted)]', border: 'border-[var(--color-mo-border-layout)]' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-[var(--color-mo-text-muted)] uppercase tracking-wider">{label}</p>
            <p className={cn('text-[22px] font-semibold mt-0.5', c.text)}>{value}</p>
          </div>
          {Icon && (
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center border', c.bg, c.border)}>
              <Icon className={cn('w-4 h-4', c.icon)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function MyWork() {
  const { currentUser, tasks, issues, timeLogs, activities, users, updateTask } = useData()
  const navigate = useNavigate()

  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && !t.archived)
  const myOpenTasks = myTasks.filter(t => t.status !== 'Done')
  const myOverdueTasks = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done')
  const myUpcomingTasks = myTasks
    .filter(t => t.dueDate && new Date(t.dueDate) >= new Date() && t.status !== 'Done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 8)

  const myIssues = issues.filter(i => i.assigneeId === currentUser.id && i.status !== 'Closed' && i.status !== 'Resolved')
  const myLogs = timeLogs.filter(tl => tl.userId === currentUser.id)
  const myLogsThisWeek = myLogs.reduce((sum, tl) => sum + (tl.dailyLogHours || 0), 0)
  const myCompletedThisWeek = myTasks.filter(t => t.status === 'Done').length

  const getUser = (id) => users.find(u => u.id === id)

  const handleStatusChange = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId)
    const completion = newStatus === 'Done' ? 100 : newStatus === 'In Progress' ? Math.max(task.completionPercent, 10) : 0
    updateTask(taskId, { status: newStatus, completionPercent: completion })
  }

  const statusIcon = (status) => {
    if (status === 'Done') return <CheckCircle2 className="w-4 h-4 text-[var(--color-mo-success-primary)]" />
    if (status === 'In Progress') return (
      <div className="w-4 h-4 rounded-full border-2 border-[var(--color-mo-brand)] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-mo-brand)]" />
      </div>
    )
    return <Circle className="w-4 h-4 text-[var(--color-mo-border-input)]" />
  }

  return (
    <div className="px-5 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-[var(--color-mo-text-primary)]">My Work</h1>
        <p className="text-[13px] text-[var(--color-mo-text-muted)] mt-0.5">What&apos;s on your plate today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Open Tasks" value={myOpenTasks.length} icon={CheckSquare} color="blue" />
        <StatCard label="Overdue" value={myOverdueTasks.length} icon={Flame} color="red" />
        <StatCard label="Hours This Week" value={myLogsThisWeek + 'h'} icon={Clock} color="gray" />
        <StatCard label="Completed" value={myCompletedThisWeek} icon={CheckCircle2} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="space-y-4">
          {/* Today's Focus */}
          <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
            <CardHeader className="px-5 py-3 border-b border-[var(--color-mo-border-layout)] flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-semibold text-[var(--color-mo-text-primary)] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--color-mo-brand)]" />
                Today&apos;s Focus
              </CardTitle>
              <span className="text-[11px] text-[var(--color-mo-text-muted)] bg-[var(--color-mo-bg-ui)] px-2 py-0.5 rounded-full font-medium">
                {myOverdueTasks.length + myUpcomingTasks.filter(t => t.dueDate === today).length}
              </span>
            </CardHeader>
            <CardContent className="px-5 py-3">
              {myOverdueTasks.length === 0 && myUpcomingTasks.filter(t => t.dueDate === today).length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-mo-success-surface)] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-mo-success-primary)]" />
                  </div>
                  <p className="text-[13px] text-[var(--color-mo-text-muted)]">Nothing due today. You&apos;re all caught up!</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {myOverdueTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-[var(--color-mo-bg-ui)] cursor-pointer group transition-colors"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, 'Done') }}
                        className="shrink-0"
                      >
                        {statusIcon(task.status)}
                      </button>
                      <span className="text-[13px] text-[var(--color-mo-text-primary)] flex-1 min-w-0 truncate">{task.title}</span>
                      <span className="text-[11px] text-[var(--color-mo-error-primary)] font-medium shrink-0">Overdue</span>
                    </div>
                  ))}
                  {myUpcomingTasks.filter(t => t.dueDate === today).map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-[var(--color-mo-bg-ui)] cursor-pointer group transition-colors"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, 'Done') }}
                        className="shrink-0"
                      >
                        {statusIcon(task.status)}
                      </button>
                      <span className="text-[13px] text-[var(--color-mo-text-primary)] flex-1 min-w-0 truncate">{task.title}</span>
                      <span className="text-[11px] text-[var(--color-mo-brand)] font-medium shrink-0">Today</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Issues */}
          <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
            <CardHeader className="px-5 py-3 border-b border-[var(--color-mo-border-layout)] flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-semibold text-[var(--color-mo-text-primary)] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--color-mo-error-primary)]" />
                My Issues
              </CardTitle>
              <span className="text-[11px] text-[var(--color-mo-text-muted)] bg-[var(--color-mo-bg-ui)] px-2 py-0.5 rounded-full font-medium">{myIssues.length}</span>
            </CardHeader>
            <CardContent className="px-5 py-3">
              {myIssues.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-mo-success-surface)] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-mo-success-primary)]" />
                  </div>
                  <p className="text-[13px] text-[var(--color-mo-text-muted)]">No open issues assigned to you.</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {myIssues.slice(0, 5).map(issue => (
                    <div
                      key={issue.id}
                      className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-[var(--color-mo-bg-ui)] cursor-pointer transition-colors"
                      onClick={() => navigate('/issues')}
                    >
                      <div className={cn('w-1.5 h-1.5 rounded-full shrink-0',
                        issue.severity === 'Critical' ? 'bg-[var(--color-mo-error-primary)]' : issue.severity === 'High' ? 'bg-[var(--color-mo-warning-primary)]' : 'bg-[var(--color-mo-text-placeholder)]'
                      )} />
                      <span className="text-[13px] text-[var(--color-mo-text-primary)] flex-1 min-w-0 truncate">{issue.title}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium border shrink-0',
                        issue.status === 'Open' ? 'bg-[var(--color-mo-error-surface)] text-[var(--color-mo-error-text)] border-[var(--color-mo-error-border)]' :
                        issue.status === 'In Progress' ? 'bg-[var(--color-mo-info-surface)] text-[var(--color-mo-info-text)] border-[var(--color-mo-info-border)]' :
                        'bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-muted)] border-[var(--color-mo-border-layout)]'
                      )}>{issue.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
            <CardHeader className="px-5 py-3 border-b border-[var(--color-mo-border-layout)] flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-semibold text-[var(--color-mo-text-primary)] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[var(--color-mo-brand)]" />
                My Tasks
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-surface)] h-7 text-[12px]" onClick={() => navigate('/tasks')}>
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="px-5 py-3">
              {myTasks.length === 0 ? (
                <div className="text-center py-10">
                  <CheckSquare className="w-10 h-10 text-[var(--color-mo-border-input)] mx-auto mb-3" />
                  <p className="text-[13px] text-[var(--color-mo-text-muted)]">No tasks assigned to you yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-mo-border-layout)]">
                  {myTasks
                    .filter(t => t.status !== 'Done')
                    .sort((a, b) => {
                      if (!a.dueDate) return 1
                      if (!b.dueDate) return -1
                      return new Date(a.dueDate) - new Date(b.dueDate)
                    })
                    .slice(0, 12)
                    .map(task => {
                      const project = task.projectId ? { name: 'Project' } : null
                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-2.5 py-2.5 px-2 rounded-md hover:bg-[var(--color-mo-bg-ui)] cursor-pointer group transition-colors"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, task.status === 'Done' ? 'To Do' : 'Done') }}
                            className="shrink-0"
                          >
                            {statusIcon(task.status)}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-[var(--color-mo-text-primary)] truncate">{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {task.tags.slice(0, 2).map(tag => {
                                const color = getLabelColor(tag)
                                return (
                                  <span key={tag} className="text-[9px] px-1 py-0 rounded font-medium border"
                                    style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}>
                                    {tag}
                                  </span>
                                )
                              })}
                              <span className="text-[11px] text-[var(--color-mo-text-muted)]">{project?.name}</span>
                            </div>
                          </div>
                          {task.dueDate && (
                            <span className={cn('text-[11px] shrink-0',
                              new Date(task.dueDate) < new Date() ? 'text-[var(--color-mo-error-primary)] font-medium' : 'text-[var(--color-mo-text-muted)]'
                            )}>
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                          <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium border shrink-0',
                            task.priority === 'High' ? 'bg-[var(--color-mo-error-surface)] text-[var(--color-mo-error-text)] border-[var(--color-mo-error-border)]' :
                            task.priority === 'Medium' ? 'bg-[var(--color-mo-warning-surface)] text-[var(--color-mo-warning-text)] border-[var(--color-mo-warning-border)]' :
                            'bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-muted)] border-[var(--color-mo-border-layout)]'
                          )}>{task.priority}</span>
                        </div>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
            <CardHeader className="px-5 py-3 border-b border-[var(--color-mo-border-layout)] flex flex-row items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--color-mo-brand)]" />
              <CardTitle className="text-[13px] font-semibold text-[var(--color-mo-text-primary)]">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-3">
              <ScrollArea className="h-48">
                <div className="space-y-0.5">
                  {activities.length === 0 ? (
                    <p className="text-[13px] text-[var(--color-mo-text-placeholder)] text-center py-4">No activity yet.</p>
                  ) : (
                    activities.slice(0, 10).map(a => {
                      const u = getUser(a.userId)
                      return (
                        <div key={a.id} className="flex gap-2.5 py-1.5 px-1 hover:bg-[var(--color-mo-bg-ui)] rounded-md transition-colors">
                          <Avatar className="w-5 h-5 shrink-0">
                            <AvatarFallback className="text-[8px] bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-secondary)] font-medium">
                              {u?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-[12px] leading-snug text-[var(--color-mo-text-secondary)] min-w-0">
                            <span className="font-medium text-[var(--color-mo-text-primary)]">{u?.name}</span>{' '}
                            <span>{a.action}</span>{' '}
                            <span className="text-[var(--color-mo-brand)]">{a.targetName}</span>
                            <span className="text-[var(--color-mo-text-placeholder)] ml-1">
                              {new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </p>
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
