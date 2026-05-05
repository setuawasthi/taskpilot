import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useData, getLabelColor } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  ArrowLeft,
  CheckSquare,
  MessageSquare,
  Clock,
  Calendar,
  Tag,
  TrendingUp,
  Plus,
  Send,
  CheckCircle2,
  Circle,
  Clock3,
  User,
  FolderKanban,
  Trash2,
  Activity,
  Copy,
  Link,
  Unlink,
  Flag,
  Archive,
  ArchiveRestore,
} from 'lucide-react'

const STATUS_CONFIG = {
  'To Do': { badge: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', next: 'In Progress' },
  'In Progress': { badge: 'bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC]', dot: 'bg-[#6366F1]', next: 'Done' },
  'Done': { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', next: null },
}

const PRIORITY_CONFIG = {
  'High': { badge: 'bg-red-50 text-red-600 border-red-200', label: 'High Priority' },
  'Medium': { badge: 'bg-amber-50 text-amber-600 border-amber-200', label: 'Medium Priority' },
  'Low': { badge: 'bg-gray-50 text-gray-500 border-gray-200', label: 'Low Priority' },
}

const today = new Date().toISOString().split('T')[0]

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    tasks, projects, users, timeLogs, activities, updateTask,
    getSubtasks, getTaskComments,
    createSubtask, updateSubtask, deleteSubtask,
    createTaskComment,
    addTaskDependency, removeTaskDependency,
    duplicateTask, deleteTask, archiveTask, unarchiveTask, toggleTaskFlag,
    createTimeLog,
    currentUser,
  } = useData()

  const task = tasks.find(t => t.id === id)

  const [newComment, setNewComment] = useState('')
  const [newSubtask, setNewSubtask] = useState('')
  const [showSubtaskInput, setShowSubtaskInput] = useState(false)
  const [showDependencyInput, setShowDependencyInput] = useState(false)
  const [dependencyQuery, setDependencyQuery] = useState('')
  const [showQuickLog, setShowQuickLog] = useState(false)
  const [quickLogHours, setQuickLogHours] = useState('')
  const [quickLogDate, setQuickLogDate] = useState(today)
  const [quickLogNotes, setQuickLogNotes] = useState('')

  if (!task) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-4">
          <CheckSquare className="w-8 h-8 text-[#A5B4FC]" />
        </div>
        <p className="text-lg font-medium text-gray-500">Task not found</p>
        <Button variant="ghost" className="mt-4 text-[#6366F1] hover:text-[#4338CA] hover:bg-[#EEF2FF]" onClick={() => navigate('/tasks')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tasks
        </Button>
      </div>
    )
  }

  const project = projects.find(p => p.id === task.projectId)
  const assignee = users.find(u => u.id === task.assigneeId)
  const taskSubtasks = getSubtasks(task.id)
  const comments = getTaskComments(task.id)
  const taskLogs = timeLogs.filter(tl => tl.taskId === task.id)
  const taskActivities = activities.filter(a => a.targetId === task.id || a.targetId === task.taskListId)

  const statusConf = STATUS_CONFIG[task.status] || STATUS_CONFIG['To Do']
  const priorityConf = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['Low']

  const dependsOn = (task.dependencies || []).map(depId => tasks.find(t => t.id === depId)).filter(Boolean)
  const blocking = tasks.filter(t => (t.dependencies || []).includes(task.id))
  const availableTasks = tasks.filter(t =>
    t.id !== task.id &&
    t.projectId === task.projectId &&
    !(task.dependencies || []).includes(t.id)
  ).filter(t => t.title.toLowerCase().includes(dependencyQuery.toLowerCase())).slice(0, 5)

  const handleStatusChange = (newStatus) => {
    const completion = newStatus === 'Done' ? 100 : newStatus === 'In Progress' ? Math.max(task.completionPercent, 10) : 0
    updateTask(task.id, { status: newStatus, completionPercent: completion })
    toast.success(`Status updated to ${newStatus}`)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    createTaskComment({ taskId: task.id, userId: currentUser.id, text: newComment.trim() })
    setNewComment('')
    toast.success('Comment added')
  }

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return
    createSubtask({ taskId: task.id, title: newSubtask.trim(), status: 'To Do', assigneeId: currentUser.id })
    setNewSubtask('')
    setShowSubtaskInput(false)
    toast.success('Subtask added')
  }

  const toggleSubtask = (subtask) => {
    const newStatus = subtask.status === 'Done' ? 'To Do' : 'Done'
    updateSubtask(subtask.id, { status: newStatus })
  }

  const handleAddDependency = (depId) => {
    addTaskDependency(task.id, depId)
    setDependencyQuery('')
    setShowDependencyInput(false)
    toast.success('Dependency added')
  }

  const handleRemoveDependency = (depId) => {
    removeTaskDependency(task.id, depId)
    toast.success('Dependency removed')
  }

  const handleDuplicate = () => {
    const duplicated = duplicateTask(task.id)
    if (duplicated) {
      navigate(`/tasks/${duplicated.id}`)
      toast.success('Task duplicated')
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id)
      navigate('/tasks')
      toast.success('Task deleted')
    }
  }

  const handleArchive = () => {
    archiveTask(task.id)
    toast.success('Task archived')
  }

  const handleUnarchive = () => {
    unarchiveTask(task.id)
    toast.success('Task unarchived')
  }

  const handleToggleFlag = () => {
    toggleTaskFlag(task.id)
    toast.success(task.flagged ? 'Flag removed' : 'Task flagged')
  }

  const handleQuickLog = () => {
    if (!quickLogHours || Number(quickLogHours) <= 0) return
    createTimeLog({
      projectId: task.projectId,
      taskId: task.id,
      userId: currentUser.id,
      title: task.title,
      dailyLogHours: Number(quickLogHours),
      date: quickLogDate,
      billingType: 'Billable',
      notes: quickLogNotes,
    })
    setQuickLogHours('')
    setQuickLogNotes('')
    setShowQuickLog(false)
    toast.success('Time logged')
  }

  const doneSubtasks = taskSubtasks.filter(st => st.status === 'Done').length

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-[#919BA8]">
        <Button variant="ghost" size="sm" className="text-[#6366F1] hover:text-[#4338CA] hover:bg-[#EEF2FF] h-7 px-2" onClick={() => navigate('/tasks')}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Tasks
        </Button>
        <span>/</span>
        <span className="text-[#5E6878] font-medium truncate max-w-[300px]">{task.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className={cn('text-[22px] font-semibold leading-tight', task.status === 'Done' ? 'text-gray-400 line-through' : 'text-[#1D2129]')}>
            {task.title}
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className={cn('h-7 text-[12px] font-medium border gap-1 w-auto min-w-[120px]', statusConf.badge)}>
                <div className={cn('w-1.5 h-1.5 rounded-full', statusConf.dot)} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['To Do', 'In Progress', 'Done'].map(s => (
                  <SelectItem key={s} value={s}>
                    <div className="flex items-center gap-2">
                      <div className={cn('w-1.5 h-1.5 rounded-full', STATUS_CONFIG[s].dot)} />
                      {s}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge className={cn('text-[11px] px-2 py-0 h-6 font-medium border', priorityConf.badge)}>
              {task.priority}
            </Badge>
            {task.tags.map(tag => {
              const color = getLabelColor(tag)
              return (
                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md font-medium border"
                  style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}>
                  {tag}
                </span>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className={cn('h-7 w-7 p-0 border-[#E8EAED]', task.flagged ? 'text-[#E64646] bg-[#FEF1F1] border-[#E64646]' : 'text-[#919BA8] hover:text-[#E64646]')}
            onClick={handleToggleFlag}
            title={task.flagged ? 'Remove flag' : 'Flag task'}
          >
            <Flag className="w-3.5 h-3.5" />
          </Button>
          {task.archived ? (
            <Button variant="outline" size="sm" className="h-7 text-[12px] gap-1 border-[#E8EAED]" onClick={handleUnarchive}>
              <ArchiveRestore className="w-3 h-3" /> Unarchive
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-7 text-[12px] gap-1 border-[#E8EAED]" onClick={handleArchive}>
              <Archive className="w-3 h-3" /> Archive
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-7 text-[12px] gap-1 border-[#E8EAED]" onClick={handleDuplicate}>
            <Copy className="w-3 h-3" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[12px] gap-1 border-[#E8EAED] text-[#E64646] hover:bg-[#FEF1F1]" onClick={handleDelete}>
            <Trash2 className="w-3 h-3" /> Delete
          </Button>
          <div className="flex items-center gap-2 text-[12px] text-[#919BA8] bg-white border border-[#E8EAED] rounded-lg px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span className={cn(task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-red-500 font-medium' : '')}>
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#5E6878] bg-white border border-[#E8EAED] rounded-lg px-3 py-1.5">
            <User className="w-3.5 h-3.5 text-[#919BA8]" />
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-[8px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                {assignee?.name.split(' ').map(n => n[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
            <span>{assignee?.name || 'Unassigned'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="px-5 py-4 border-b border-[#E8EAED] flex flex-row items-center gap-2">
              <Activity className="w-4 h-4 text-[#6366F1]" />
              <CardTitle className="text-[13px] font-semibold text-[#1D2129]">Description</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              <p className="text-[13px] text-[#5E6878] leading-relaxed whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Subtasks */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="px-5 py-4 border-b border-[#E8EAED] flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#6366F1]" />
                <CardTitle className="text-[13px] font-semibold text-[#1D2129]">Subtasks</CardTitle>
                <span className="text-[11px] text-[#919BA8] bg-[#F4F5F7] px-2 py-0.5 rounded-full font-medium">
                  {doneSubtasks}/{taskSubtasks.length} done
                </span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[12px] text-[#6366F1] hover:bg-[#EEF2FF] gap-1"
                onClick={() => setShowSubtaskInput(!showSubtaskInput)}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </CardHeader>
            <CardContent className="px-5 py-3">
              {showSubtaskInput && (
                <div className="flex items-center gap-2 mb-3">
                  <Input
                    value={newSubtask}
                    onChange={e => setNewSubtask(e.target.value)}
                    placeholder="What needs to be done?"
                    className="h-8 text-[13px] border-[#E8EAED] focus:border-[#6366F1]"
                    onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                    autoFocus
                  />
                  <Button size="sm" className="h-8 bg-[#6366F1] hover:bg-[#4F46E5] text-white" onClick={handleAddSubtask}>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
              <div className="space-y-1">
                {taskSubtasks.map(st => (
                  <div key={st.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-[#F7F8FA] group">
                    <button
                      onClick={() => toggleSubtask(st)}
                      className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                        st.status === 'Done'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-[#DDE0E4] hover:border-[#6366F1]'
                      )}
                    >
                      {st.status === 'Done' && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                    <span className={cn('text-[13px] flex-1', st.status === 'Done' ? 'line-through text-[#919BA8]' : 'text-[#1D2129]')}>
                      {st.title}
                    </span>
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-[8px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                        {users.find(u => u.id === st.assigneeId)?.name.split(' ').map(n => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => deleteSubtask(st.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#B8BFC7] hover:text-red-500 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {taskSubtasks.length === 0 && (
                  <p className="text-[13px] text-[#B8BFC7] py-3 text-center">No subtasks yet. Add one above.</p>
                )}
              </div>
              {taskSubtasks.length > 0 && (
                <div className="mt-3">
                  <div className="h-1.5 bg-[#F4F5F7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6366F1] rounded-full transition-all"
                      style={{ width: `${taskSubtasks.length > 0 ? (doneSubtasks / taskSubtasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dependencies */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="px-5 py-4 border-b border-[#E8EAED] flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-[#6366F1]" />
                <CardTitle className="text-[13px] font-semibold text-[#1D2129]">Dependencies</CardTitle>
                {(dependsOn.length > 0 || blocking.length > 0) && (
                  <span className="text-[11px] text-[#919BA8] bg-[#F4F5F7] px-2 py-0.5 rounded-full font-medium">
                    {dependsOn.length + blocking.length}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[12px] text-[#6366F1] hover:bg-[#EEF2FF] gap-1"
                onClick={() => setShowDependencyInput(!showDependencyInput)}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </CardHeader>
            <CardContent className="px-5 py-3 space-y-4">
              {/* Depends On */}
              <div>
                <p className="text-[11px] font-semibold text-[#919BA8] uppercase tracking-wider mb-2">Depends On</p>
                {showDependencyInput && (
                  <div className="mb-3 space-y-2">
                    <Input
                      value={dependencyQuery}
                      onChange={e => setDependencyQuery(e.target.value)}
                      placeholder="Search tasks in this project..."
                      className="h-8 text-[13px] border-[#E8EAED] focus:border-[#6366F1]"
                      autoFocus
                    />
                    {dependencyQuery.trim().length > 0 && (
                      <div className="space-y-1">
                        {availableTasks.length === 0 ? (
                          <p className="text-[12px] text-[#B8BFC7] px-2">No tasks found</p>
                        ) : (
                          availableTasks.map(t => (
                            <button
                              key={t.id}
                              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-left text-[13px] hover:bg-[#F7F8FA] transition-colors"
                              onClick={() => handleAddDependency(t.id)}
                            >
                              <CheckSquare className="w-3.5 h-3.5 text-[#919BA8]" />
                              <span className="text-[#1D2129] truncate">{t.title}</span>
                              <span className={cn('text-[10px] px-1.5 py-0 rounded font-medium ml-auto',
                                t.status === 'Done' ? 'bg-emerald-50 text-emerald-600' :
                                t.status === 'In Progress' ? 'bg-[#EEF2FF] text-[#4338CA]' :
                                'bg-gray-50 text-gray-500'
                              )}>{t.status}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-1">
                  {dependsOn.map(dep => (
                    <div key={dep.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-[#F7F8FA] group">
                      <Link className="w-3.5 h-3.5 text-[#919BA8] shrink-0" />
                      <span
                        className="text-[13px] text-[#1D2129] flex-1 cursor-pointer hover:text-[#6366F1]"
                        onClick={() => navigate(`/tasks/${dep.id}`)}
                      >
                        {dep.title}
                      </span>
                      <span className={cn('text-[10px] px-1.5 py-0 rounded font-medium',
                        dep.status === 'Done' ? 'bg-emerald-50 text-emerald-600' :
                        dep.status === 'In Progress' ? 'bg-[#EEF2FF] text-[#4338CA]' :
                        'bg-gray-50 text-gray-500'
                      )}>{dep.status}</span>
                      <button
                        onClick={() => handleRemoveDependency(dep.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#B8BFC7] hover:text-red-500 transition-opacity"
                      >
                        <Unlink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {dependsOn.length === 0 && (
                    <p className="text-[13px] text-[#B8BFC7] py-2">No dependencies. Add tasks this task depends on.</p>
                  )}
                </div>
              </div>

              {/* Blocking */}
              {blocking.length > 0 && (
                <>
                  <Separator className="bg-[#F4F5F7]" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#919BA8] uppercase tracking-wider mb-2">Blocking</p>
                    <div className="space-y-1">
                      {blocking.map(blocked => (
                        <div key={blocked.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-[#F7F8FA]">
                          <Link className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span
                            className="text-[13px] text-[#1D2129] flex-1 cursor-pointer hover:text-[#6366F1]"
                            onClick={() => navigate(`/tasks/${blocked.id}`)}
                          >
                            {blocked.title}
                          </span>
                          <span className={cn('text-[10px] px-1.5 py-0 rounded font-medium',
                            blocked.status === 'Done' ? 'bg-emerald-50 text-emerald-600' :
                            blocked.status === 'In Progress' ? 'bg-[#EEF2FF] text-[#4338CA]' :
                            'bg-gray-50 text-gray-500'
                          )}>{blocked.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="px-5 py-4 border-b border-[#E8EAED] flex flex-row items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#6366F1]" />
              <CardTitle className="text-[13px] font-semibold text-[#1D2129]">Comments</CardTitle>
              <span className="text-[11px] text-[#919BA8] bg-[#F4F5F7] px-2 py-0.5 rounded-full font-medium">{comments.length}</span>
            </CardHeader>
            <CardContent className="px-5 py-4 space-y-4">
              {/* Add comment */}
              <div className="flex gap-3">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback className="text-[9px] bg-gradient-to-br from-[#6366F1] to-[#818CF8] text-white font-semibold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="text-[13px] border-[#E8EAED] focus:border-[#6366F1] min-h-[60px] resize-none"
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment() } }}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" className="h-7 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[12px] gap-1"
                      onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="w-3 h-3" /> Comment
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="bg-[#E8EAED]" />

              {/* Comments list */}
              <div className="space-y-3">
                {comments.slice().reverse().map(comment => {
                  const commentUser = users.find(u => u.id === comment.userId)
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarFallback className="text-[9px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                          {commentUser?.name.split(' ').map(n => n[0]).join('') || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-[#1D2129]">{commentUser?.name}</span>
                          <span className="text-[11px] text-[#919BA8]">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#5E6878] mt-0.5 whitespace-pre-wrap">{comment.text}</p>
                      </div>
                    </div>
                  )
                })}
                {comments.length === 0 && (
                  <p className="text-[13px] text-[#B8BFC7] text-center py-3">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="px-5 py-4 border-b border-[#E8EAED] flex flex-row items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#6366F1]" />
              <CardTitle className="text-[13px] font-semibold text-[#1D2129]">Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-3">
              <ScrollArea className="h-48">
                <div className="space-y-0.5">
                  {taskActivities.length === 0 ? (
                    <p className="text-[13px] text-[#B8BFC7] text-center py-4">No activity yet.</p>
                  ) : (
                    taskActivities.slice().reverse().map(a => {
                      const u = users.find(x => x.id === a.userId)
                      return (
                        <div key={a.id} className="flex gap-2.5 py-1.5 px-1 hover:bg-[#F7F8FA] rounded-md transition-colors">
                          <Avatar className="w-5 h-5 shrink-0">
                            <AvatarFallback className="text-[8px] bg-[#F4F5F7] text-[#5E6878] font-medium">
                              {u?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-[12px] leading-snug text-[#5E6878] min-w-0">
                            <span className="font-medium text-[#1D2129]">{u?.name}</span>{' '}
                            <span>{a.action}</span>{' '}
                            <span className="text-[#6366F1]">{a.targetName}</span>
                            <span className="text-[#B8BFC7] ml-1">
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

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Metadata */}
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#919BA8]">Project</span>
                  <Button variant="ghost" size="sm" className="h-6 text-[12px] text-[#6366F1] hover:bg-[#EEF2FF] gap-1 px-2"
                    onClick={() => project && navigate(`/projects/${project.id}`)}>
                    <FolderKanban className="w-3 h-3" />
                    {project?.name || '—'}
                  </Button>
                </div>
                <Separator className="bg-[#F4F5F7]" />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#919BA8]">Assignee</span>
                  <div className="flex items-center gap-1.5">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-[8px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                        {assignee?.name.split(' ').map(n => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[12px] text-[#5E6878]">{assignee?.name || 'Unassigned'}</span>
                  </div>
                </div>
                <Separator className="bg-[#F4F5F7]" />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#919BA8]">Due Date</span>
                  <span className={cn('text-[12px]', task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-red-500 font-medium' : 'text-[#5E6878]')}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </span>
                </div>
                <Separator className="bg-[#F4F5F7]" />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#919BA8]">Priority</span>
                  <Badge className={cn('text-[10px] px-1.5 py-0 h-5 border', priorityConf.badge)}>{task.priority}</Badge>
                </div>
                <Separator className="bg-[#F4F5F7]" />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#919BA8]">Progress</span>
                  <span className="text-[12px] font-medium text-[#5E6878]">{task.completionPercent}%</span>
                </div>
                <div className="h-1.5 bg-[#F4F5F7] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6366F1] rounded-full transition-all" style={{ width: `${task.completionPercent}%` }} />
                </div>
                <Separator className="bg-[#F4F5F7]" />
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#919BA8]">Time Logged</span>
                  <span className="text-[12px] text-[#5E6878]">{taskLogs.reduce((s, tl) => s + (tl.dailyLogHours || 0), 0)}h</span>
                </div>
                <Separator className="bg-[#F4F5F7]" />
                <div>
                  <span className="text-[12px] text-[#919BA8] block mb-1.5">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map(tag => {
                      const color = getLabelColor(tag)
                      return (
                        <span key={tag} className="text-[11px] px-1.5 py-0.5 rounded-md font-medium border"
                          style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}>
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Logs */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="px-4 py-3 border-b border-[#E8EAED] flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#6366F1]" />
                <CardTitle className="text-[12px] font-semibold text-[#1D2129]">Time Logs</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="h-6 text-[11px] text-[#6366F1] hover:bg-[#EEF2FF] gap-1 px-1.5"
                onClick={() => setShowQuickLog(!showQuickLog)}>
                <Plus className="w-3 h-3" /> Log time
              </Button>
            </CardHeader>
            <CardContent className="px-4 py-2">
              {showQuickLog && (
                <div className="space-y-2 mb-3 pb-3 border-b border-[#F4F5F7]">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Hours"
                      value={quickLogHours}
                      onChange={e => setQuickLogHours(e.target.value)}
                      className="h-7 text-[12px] w-20 border-[#E8EAED] focus:border-[#6366F1]"
                    />
                    <Input
                      type="date"
                      value={quickLogDate}
                      onChange={e => setQuickLogDate(e.target.value)}
                      className="h-7 text-[12px] border-[#E8EAED] focus:border-[#6366F1]"
                    />
                  </div>
                  <Input
                    placeholder="Notes (optional)"
                    value={quickLogNotes}
                    onChange={e => setQuickLogNotes(e.target.value)}
                    className="h-7 text-[12px] border-[#E8EAED] focus:border-[#6366F1]"
                    onKeyDown={e => e.key === 'Enter' && handleQuickLog()}
                  />
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2" onClick={() => setShowQuickLog(false)}>Cancel</Button>
                    <Button size="sm" className="h-6 text-[11px] bg-[#6366F1] hover:bg-[#4F46E5] text-white px-2"
                      onClick={handleQuickLog} disabled={!quickLogHours || Number(quickLogHours) <= 0}>
                      Log
                    </Button>
                  </div>
                </div>
              )}
              {taskLogs.length > 0 ? (
                <div className="space-y-1">
                  {taskLogs.map(tl => (
                    <div key={tl.id} className="flex items-center justify-between py-1.5 text-[12px]">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-[7px] bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                            {users.find(u => u.id === tl.userId)?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[#5E6878]">{new Date(tl.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <span className="font-medium text-[#1D2129]">{tl.dailyLogHours}h</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-[#B8BFC7] py-2 text-center">No time logs yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
