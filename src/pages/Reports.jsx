import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, FolderKanban, CheckSquare, AlertCircle, CheckCircle2, Clock, Users } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    blue: { bg: 'bg-[var(--color-mo-info-surface)]', text: 'text-[var(--color-mo-info-text)]', icon: 'text-[var(--color-mo-info-primary)]', border: 'border-[var(--color-mo-info-border)]' },
    green: { bg: 'bg-[var(--color-mo-success-surface)]', text: 'text-[var(--color-mo-success-text)]', icon: 'text-[var(--color-mo-success-primary)]', border: 'border-[var(--color-mo-success-border)]' },
    red: { bg: 'bg-[var(--color-mo-error-surface)]', text: 'text-[var(--color-mo-error-text)]', icon: 'text-[var(--color-mo-error-primary)]', border: 'border-[var(--color-mo-error-border)]' },
    amber: { bg: 'bg-[var(--color-mo-warning-surface)]', text: 'text-[var(--color-mo-warning-text)]', icon: 'text-[var(--color-mo-warning-primary)]', border: 'border-[var(--color-mo-warning-border)]' },
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

function HorizontalBarChart({ data, color = 'blue' }) {
  const max = Math.max(...data.map(d => d.value), 1)
  const total = data.reduce((s, d) => s + d.value, 0)

  const colorMap = {
    blue: { bar: 'bg-[var(--color-mo-brand)]', track: 'bg-[var(--color-mo-brand-surface)]' },
    green: { bar: 'bg-[var(--color-mo-success-primary)]', track: 'bg-[var(--color-mo-success-surface)]' },
    red: { bar: 'bg-[var(--color-mo-error-primary)]', track: 'bg-[var(--color-mo-error-surface)]' },
    amber: { bar: 'bg-[var(--color-mo-warning-primary)]', track: 'bg-[var(--color-mo-warning-surface)]' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = total > 0 ? (d.value / total) * 100 : 0
        return (
          <div key={i}>
            <div className="flex items-center justify-between text-[12px] mb-1.5">
              <span className="text-[var(--color-mo-text-secondary)] font-medium">{d.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--color-mo-text-primary)]">{d.value}</span>
                <span className="text-[var(--color-mo-text-muted)] w-8 text-right">{Math.round(pct)}%</span>
              </div>
            </div>
            <div className={cn('h-2 w-full rounded-full overflow-hidden', c.track)}>
              <div
                className={cn('h-full rounded-full transition-all duration-500', c.bar)}
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DonutChart({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const colors = [
    'var(--color-mo-brand)',
    'var(--color-mo-success-primary)',
    'var(--color-mo-warning-primary)',
    'var(--color-mo-error-primary)',
    'var(--color-mo-text-muted)',
  ]

  let cumulativePercent = 0
  const segments = data.map((d, i) => {
    const percent = total > 0 ? (d.value / total) * 100 : 0
    const startPercent = cumulativePercent
    cumulativePercent += percent
    return {
      ...d,
      percent,
      startPercent,
      color: colors[i % colors.length],
    }
  })

  const cx = size / 2
  const cy = size / 2
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--color-mo-border-layout)"
          strokeWidth="10"
        />
        {segments.map((seg, i) => {
          const offset = circumference - (seg.percent / 100) * circumference
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transformOrigin: 'center',
                transform: `rotate(${seg.startPercent * 3.6}deg)`,
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
          )
        })}
      </svg>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px]">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-[var(--color-mo-text-secondary)]">{seg.label}</span>
            <span className="font-semibold text-[var(--color-mo-text-primary)] ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Reports() {
  const { projects, tasks, issues, users, timeLogs } = useData()

  const projectStatusData = [
    { label: 'Active', value: projects.filter(p => p.status === 'Active').length },
    { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length },
    { label: 'On Hold', value: projects.filter(p => p.status === 'On Hold').length },
  ]

  const taskStatusData = [
    { label: 'To Do', value: tasks.filter(t => t.status === 'To Do').length },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { label: 'Done', value: tasks.filter(t => t.status === 'Done').length },
  ]

  const issueStatusData = [
    { label: 'Open', value: issues.filter(i => i.status === 'Open').length },
    { label: 'In Progress', value: issues.filter(i => i.status === 'In Progress').length },
    { label: 'Resolved / Closed', value: issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length },
  ]

  const tasksByOwner = users.map(u => ({
    label: u.name.split(' ')[0],
    value: tasks.filter(t => t.assigneeId === u.id).length,
  })).filter(d => d.value > 0)

  const tasksByPriority = [
    { label: 'High', value: tasks.filter(t => t.priority === 'High').length },
    { label: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length },
    { label: 'Low', value: tasks.filter(t => t.priority === 'Low').length },
  ]

  const totalHours = timeLogs.reduce((s, t) => s + (t.dailyLogHours || 0), 0)
  const completedTasks = tasks.filter(t => t.status === 'Done').length

  return (
    <div className="px-5 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-[var(--color-mo-text-primary)]">Reports</h1>
        <p className="text-[13px] text-[var(--color-mo-text-muted)] mt-0.5">Quick insights across projects, tasks, and issues.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Projects" value={projects.length} icon={FolderKanban} color="blue" />
        <StatCard label="Total Tasks" value={tasks.length} icon={CheckSquare} color="gray" />
        <StatCard label="Open Issues" value={issues.filter(i => i.status === 'Open').length} icon={AlertCircle} color="red" />
        <StatCard label="Completed" value={completedTasks} icon={CheckCircle2} color="green" />
        <StatCard label="Hours Logged" value={totalHours + 'h'} icon={Clock} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Project Status */}
        <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
          <CardHeader className="border-b border-[var(--color-mo-border-layout)] px-5 py-3 flex flex-row items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[var(--color-mo-brand)]" />
            <CardTitle className="text-[13px] font-semibold text-[var(--color-mo-text-primary)]">Project Status</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <HorizontalBarChart data={projectStatusData} color="blue" />
          </CardContent>
        </Card>

        {/* Task Status */}
        <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
          <CardHeader className="border-b border-[var(--color-mo-border-layout)] px-5 py-3 flex flex-row items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[var(--color-mo-success-primary)]" />
            <CardTitle className="text-[13px] font-semibold text-[var(--color-mo-text-primary)]">Task Status</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <HorizontalBarChart data={taskStatusData} color="green" />
          </CardContent>
        </Card>

        {/* Issue Status */}
        <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
          <CardHeader className="border-b border-[var(--color-mo-border-layout)] px-5 py-3 flex flex-row items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[var(--color-mo-error-primary)]" />
            <CardTitle className="text-[13px] font-semibold text-[var(--color-mo-text-primary)]">Issue Status</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <HorizontalBarChart data={issueStatusData} color="red" />
          </CardContent>
        </Card>

        {/* Tasks by Assignee */}
        <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white">
          <CardHeader className="border-b border-[var(--color-mo-border-layout)] px-5 py-3 flex flex-row items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-mo-brand)]" />
            <CardTitle className="text-[13px] font-semibold text-[var(--color-mo-text-primary)]">Tasks by Assignee</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <HorizontalBarChart data={tasksByOwner} color="amber" />
          </CardContent>
        </Card>

        {/* Tasks by Priority - Donut Chart */}
        <Card className="shadow-sm border border-[var(--color-mo-border-layout)] bg-white lg:col-span-2">
          <CardHeader className="border-b border-[var(--color-mo-border-layout)] px-5 py-3 flex flex-row items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[var(--color-mo-warning-primary)]" />
            <CardTitle className="text-[13px] font-semibold text-[var(--color-mo-text-primary)]">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex items-center justify-center">
              <DonutChart data={tasksByPriority} size={140} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
