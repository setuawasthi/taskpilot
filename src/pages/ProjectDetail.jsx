import { useParams, useNavigate } from 'react-router-dom'
import { useData, getLabelColor } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckSquare,
  AlertCircle,
  Layers,
  Clock,
  TrendingUp,
  FolderKanban,
} from 'lucide-react'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, tasks, issues, phases, timeLogs, activities, users } = useData()

  const project = projects.find(p => p.id === id)
  if (!project) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-4">
          <FolderKanban className="w-8 h-8 text-[#A5B4FC]" />
        </div>
        <p className="text-lg font-medium text-gray-500">Project not found</p>
        <Button variant="ghost" className="mt-4 text-[#6366F1] hover:text-[#4338CA] hover:bg-[#EEF2FF]" onClick={() => navigate('/projects')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
        </Button>
      </div>
    )
  }

  const projectTasks = tasks.filter(t => t.projectId === id)
  const projectIssues = issues.filter(i => i.projectId === id)
  const projectPhases = phases.filter(p => p.projectId === id)
  const projectLogs = timeLogs.filter(tl => tl.projectId === id)
  const projectActivities = activities.filter(a => a.targetId === id || projectTasks.some(t => t.id === a.targetId) || projectIssues.some(i => i.id === a.targetId))
  const owner = users.find(u => u.id === project.ownerId)
  const team = users.filter(u => project.teamMemberIds.includes(u.id))

  const statusBadge = (status) => {
    if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200 border'
    if (status === 'Active') return 'bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC] border'
    return 'bg-gray-50 text-gray-500 border-gray-200 border'
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-5 lg:px-8 py-5">
      <Button variant="ghost" size="sm" className="text-[#6366F1] hover:text-[#4338CA] hover:bg-[#EEF2FF]" onClick={() => navigate('/projects')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <div className="rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] p-5 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <p className="text-[#A5B4FC] text-sm mt-0.5">{project.description}</p>
            </div>
          </div>
          <Badge className={cn('text-sm px-3 py-1', statusBadge(project.status))}>{project.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</p>
            <div className="flex items-center gap-3 mt-2">
              <Progress value={project.progress} className="flex-1" />
              <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 ring-1 ring-indigo-200 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{projectTasks.length}</p>
              <p className="text-xs font-medium text-gray-500">Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 ring-1 ring-amber-200 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{projectIssues.length}</p>
              <p className="text-xs font-medium text-gray-500">Issues</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{projectLogs.reduce((s, tl) => s + (tl.dailyLogHours || 0), 0)}h</p>
              <p className="text-xs font-medium text-gray-500">Logged</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-gray-50 border-0 h-auto p-1 rounded-xl">
          <TabsTrigger value="overview" className="data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Tasks</TabsTrigger>
          <TabsTrigger value="issues" className="data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Issues</TabsTrigger>
          <TabsTrigger value="phases" className="data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Phases</TabsTrigger>
          <TabsTrigger value="timelogs" className="data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Time Logs</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] data-[state=active]:border-b-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-sm border-0 bg-white lg:col-span-2">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#6366F1]" />
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Owner</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-[10px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                          {owner?.name.split(' ').map(n => n[0]).join('') || '-'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{owner?.name || '-'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
                    <Badge className={cn('text-xs', statusBadge(project.status))}>{project.status}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Start Date</p>
                    <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">End Date</p>
                    <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                    </div>
                  </div>
                </div>
                <Separator className="bg-gray-100" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-gray-700 mt-1">{project.description || 'No description provided.'}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#6366F1]" />
                  Team
                  <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">{team.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {team.map(u => (
                  <div key={u.id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-[11px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold ring-1 ring-[#A5B4FC]">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.role}</p>
                    </div>
                  </div>
                ))}
                {team.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No team members.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <TaskTable rows={projectTasks} users={users} />
        </TabsContent>

        <TabsContent value="issues" className="mt-6">
          <IssueTable rows={projectIssues} users={users} />
        </TabsContent>

        <TabsContent value="phases" className="mt-6">
          <PhaseTable rows={projectPhases} users={users} />
        </TabsContent>

        <TabsContent value="timelogs" className="mt-6">
          <TimeLogTable rows={projectLogs} users={users} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#6366F1]" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <ScrollArea className="h-72">
                <div className="space-y-1">
                  {projectActivities.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-[#A5B4FC]" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No activity yet.</p>
                    </div>
                  ) : projectActivities.map(a => {
                    const u = users.find(x => x.id === a.userId)
                    return (
                      <div key={a.id} className="flex gap-3 px-1 py-2.5 hover:bg-gray-50/50 rounded-lg transition-colors">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="text-[10px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold ring-1 ring-[#A5B4FC]">
                            {u?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">{u?.name}</span>{' '}
                            <span className="text-gray-500">{a.action}</span>{' '}
                            <span className="font-medium text-[#6366F1]">{a.targetName}</span>
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {new Date(a.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TaskTable({ rows, users }) {
  const navigate = useNavigate()
  const getUser = id => users.find(u => u.id === id)
  const statusBadge = s => {
    if (s === 'Done') return 'bg-emerald-50 text-emerald-700 border-emerald-200 border'
    if (s === 'In Progress') return 'bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC] border'
    return 'bg-gray-50 text-gray-500 border-gray-200 border'
  }
  const priorityBadge = p => {
    if (p === 'High') return 'bg-red-50 text-red-600 border-red-200 border'
    if (p === 'Medium') return 'bg-amber-50 text-amber-600 border-amber-200 border'
    return 'bg-gray-50 text-gray-500 border-gray-200 border'
  }
  return (
    <Card className="shadow-sm border-0 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {rows.map(t => (
              <TableRow key={t.id} className="hover:bg-[#EEF2FF]/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/tasks/${t.id}`)}>
                <TableCell className="px-4 py-3">
                  <p className="font-medium text-gray-900">{t.title}</p>
                  <div className="flex gap-1.5 mt-1">
                    {t.tags.map(tag => {
                      const color = getLabelColor(tag)
                      return (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 border font-medium"
                          style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}>
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  {t.assigneeId ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-[9px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                          {getUser(t.assigneeId)?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700">{getUser(t.assigneeId)?.name}</span>
                    </div>
                  ) : <span className="text-gray-400">-</span>}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-400">{t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</TableCell>
                <TableCell className="px-4 py-3"><Badge className={cn('text-[10px] px-1.5 py-0 h-5 hover:bg-opacity-80', priorityBadge(t.priority))}>{t.priority}</Badge></TableCell>
                <TableCell className="px-4 py-3"><Badge className={cn('text-xs', statusBadge(t.status))}>{t.status}</Badge></TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress value={t.completionPercent} className="w-16" />
                    <span className="text-[11px] font-medium text-gray-400">{t.completionPercent}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-3">
                    <CheckSquare className="w-6 h-6 text-[#A5B4FC]" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No tasks yet.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

function IssueTable({ rows, users }) {
  const getUser = id => users.find(u => u.id === id)
  const severityBadge = s => {
    if (s === 'Critical') return 'bg-red-50 text-red-700 border-red-200 border'
    if (s === 'High') return 'bg-amber-50 text-amber-700 border-amber-200 border'
    return 'bg-gray-50 text-gray-500 border-gray-200 border'
  }
  const statusBadge = s => {
    if (s === 'Closed' || s === 'Resolved') return 'bg-emerald-50 text-emerald-700 border-emerald-200 border'
    if (s === 'In Progress') return 'bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC] border'
    return 'bg-red-50 text-red-700 border-red-200 border'
  }
  return (
    <Card className="shadow-sm border-0 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reporter</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {rows.map(i => (
              <TableRow key={i.id} className="hover:bg-[#EEF2FF]/20 transition-colors">
                <TableCell className="px-4 py-3 font-medium text-gray-900">{i.title}</TableCell>
                <TableCell className="px-4 py-3">
                  {i.reporterId ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-[9px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                          {getUser(i.reporterId)?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700">{getUser(i.reporterId)?.name}</span>
                    </div>
                  ) : <span className="text-gray-400">-</span>}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {i.assigneeId ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-[9px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                          {getUser(i.assigneeId)?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700">{getUser(i.assigneeId)?.name}</span>
                    </div>
                  ) : <span className="text-gray-400">-</span>}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-400">{i.dueDate ? new Date(i.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</TableCell>
                <TableCell className="px-4 py-3"><Badge className={cn('text-[10px] px-1.5 py-0 h-5', severityBadge(i.severity))}>{i.severity}</Badge></TableCell>
                <TableCell className="px-4 py-3"><Badge className={cn('text-xs', statusBadge(i.status))}>{i.status}</Badge></TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6 text-[#A5B4FC]" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No issues yet.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

function PhaseTable({ rows, users }) {
  const getUser = id => users.find(u => u.id === id)
  const statusBadge = s => {
    if (s === 'Completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200 border'
    if (s === 'In Progress') return 'bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC] border'
    return 'bg-gray-50 text-gray-500 border-gray-200 border'
  }
  return (
    <Card className="shadow-sm border-0 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phase</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {rows.map(ph => (
              <TableRow key={ph.id} className="hover:bg-[#EEF2FF]/20 transition-colors">
                <TableCell className="px-4 py-3 font-medium text-gray-900">{ph.name}</TableCell>
                <TableCell className="px-4 py-3">
                  {ph.ownerId ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-[9px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                          {getUser(ph.ownerId)?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700">{getUser(ph.ownerId)?.name}</span>
                    </div>
                  ) : <span className="text-gray-400">-</span>}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-400">{ph.startDate ? new Date(ph.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</TableCell>
                <TableCell className="px-4 py-3 text-gray-400">{ph.endDate ? new Date(ph.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</TableCell>
                <TableCell className="px-4 py-3"><Badge className={cn('text-xs', statusBadge(ph.status))}>{ph.status}</Badge></TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress value={ph.progress} className="w-20" />
                    <span className="text-[11px] font-medium text-gray-400">{ph.progress}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6 text-[#A5B4FC]" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No phases yet.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

function TimeLogTable({ rows, users }) {
  const getUser = id => users.find(u => u.id === id)
  const billingBadge = b => {
    if (b === 'Billable') return 'bg-emerald-50 text-emerald-700 border-emerald-200 border'
    return 'bg-gray-50 text-gray-500 border-gray-200 border'
  }
  return (
    <Card className="shadow-sm border-0 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Billing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {rows.map(tl => (
              <TableRow key={tl.id} className="hover:bg-[#EEF2FF]/20 transition-colors">
                <TableCell className="px-4 py-3 font-medium text-gray-900">{tl.title}</TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-[9px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                        {getUser(tl.userId)?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700">{getUser(tl.userId)?.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-400">{new Date(tl.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</TableCell>
                <TableCell className="px-4 py-3 font-semibold text-gray-900">{tl.dailyLogHours}h</TableCell>
                <TableCell className="px-4 py-3"><Badge className={cn('text-xs', billingBadge(tl.billingType))}>{tl.billingType}</Badge></TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-[#A5B4FC]" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No time logs yet.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}