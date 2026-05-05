import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData, getLabelColor } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Plus,
  List,
  LayoutGrid,
  Filter,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  Circle,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  X,
  Flag,
  Archive,
  ArchiveRestore,
} from 'lucide-react'

const STATUS_CONFIG = {
  'To Do': { color: 'bg-[var(--color-mo-bg-ui)]', text: 'text-[var(--color-mo-text-secondary)]', dot: 'bg-[var(--color-mo-text-placeholder)]', badge: 'bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-secondary)] border-[var(--color-mo-border-layout)]' },
  'In Progress': { color: 'bg-[var(--color-mo-info-surface)]', text: 'text-[var(--color-mo-info-primary)]', dot: 'bg-[var(--color-mo-brand)]', badge: 'bg-[var(--color-mo-info-surface)] text-[var(--color-mo-info-text)] border-[var(--color-mo-info-border)]' },
  'Done': { color: 'bg-[var(--color-mo-success-surface)]', text: 'text-[var(--color-mo-success-primary)]', dot: 'bg-[var(--color-mo-success-primary)]', badge: 'bg-[var(--color-mo-success-surface)] text-[var(--color-mo-success-text)] border-[var(--color-mo-success-border)]' },
}

const PRIORITY_CONFIG = {
  'High': { icon: 'text-[var(--color-mo-error-primary)]', badge: 'bg-[var(--color-mo-error-surface)] text-[var(--color-mo-error-text)] border-[var(--color-mo-error-border)]' },
  'Medium': { icon: 'text-[var(--color-mo-warning-primary)]', badge: 'bg-[var(--color-mo-warning-surface)] text-[var(--color-mo-warning-text)] border-[var(--color-mo-warning-border)]' },
  'Low': { icon: 'text-[var(--color-mo-text-placeholder)]', badge: 'bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-muted)] border-[var(--color-mo-border-layout)]' },
}

export default function Tasks() {
  const navigate = useNavigate()
  const { tasks, projects, users, createTask, updateTask, deleteTask, duplicateTask, archiveTask, unarchiveTask, toggleTaskFlag } = useData()
  const [viewMode, setViewMode] = useState('list')
  const [groupBy, setGroupBy] = useState('none')
  const [filterProject, setFilterProject] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showArchived, setShowArchived] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', projectId: '', assigneeId: '', priority: 'Medium', status: 'To Do', dueDate: '', tags: '' })
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const getUser = id => users.find(u => u.id === id)
  const getProject = id => projects.find(p => p.id === id)

  let filtered = tasks.filter(t => showArchived ? true : !t.archived)
  if (filterProject !== 'all') filtered = filtered.filter(t => t.projectId === filterProject)
  if (filterStatus !== 'all') filtered = filtered.filter(t => t.status === filterStatus)

  const grouped = groupBy === 'project' ? groupTasks(filtered, 'projectId', getProject) :
                  groupBy === 'assignee' ? groupTasks(filtered, 'assigneeId', getUser) :
                  groupBy === 'priority' ? groupTasks(filtered, 'priority', v => ({ name: v })) :
                  { All: filtered }

  const handleCreate = () => {
    if (!form.title.trim() || !form.projectId) return
    createTask({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      completionPercent: 0,
      startDate: new Date().toISOString().split('T')[0],
      dependencies: [],
    })
    toast.success('Task created')
    setForm({ title: '', projectId: '', assigneeId: '', priority: 'Medium', status: 'To Do', dueDate: '', tags: '' })
    setOpen(false)
  }

  const handleStatusChange = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId)
    const completion = newStatus === 'Done' ? 100 : newStatus === 'In Progress' ? Math.max(task.completionPercent, 10) : 0
    updateTask(taskId, { status: newStatus, completionPercent: completion })
    toast.success(`Moved to ${newStatus}`)
  }

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = (items) => {
    const allSelected = items.every(t => selectedIds.has(t.id))
    setSelectedIds(prev => {
      const next = new Set(prev)
      items.forEach(t => {
        if (allSelected) next.delete(t.id)
        else next.add(t.id)
      })
      return next
    })
  }

  const handleBulkStatus = (newStatus) => {
    selectedIds.forEach(id => handleStatusChange(id, newStatus))
    setSelectedIds(new Set())
    toast.success(`Updated ${selectedIds.size} tasks`)
  }

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteTask(id))
    setSelectedIds(new Set())
    toast.success(`Deleted ${selectedIds.size} tasks`)
  }

  const handleDuplicate = (taskId) => {
    const duplicated = duplicateTask(taskId)
    if (duplicated) toast.success('Task duplicated')
  }

  const startInlineEdit = (task) => {
    setEditingId(task.id)
    setEditValue(task.title)
  }

  const saveInlineEdit = (taskId) => {
    if (editValue.trim()) {
      updateTask(taskId, { title: editValue.trim() })
    }
    setEditingId(null)
    setEditValue('')
  }

  const cancelInlineEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-5 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--color-mo-text-primary)]">Tasks</h1>
          <p className="text-[13px] text-[var(--color-mo-text-muted)] mt-0.5">Track and manage tasks across all projects.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-36 h-9 bg-white border-[var(--color-mo-border-layout)] focus:border-[var(--color-mo-brand)]"><SelectValue placeholder="All Projects" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 h-9 bg-white border-[var(--color-mo-border-layout)] focus:border-[var(--color-mo-brand)]"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {['To Do', 'In Progress', 'Done'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-32 h-9 bg-white border-[var(--color-mo-border-layout)] focus:border-[var(--color-mo-brand)]">
              <Filter className="w-3.5 h-3.5 mr-2 text-[var(--color-mo-text-muted)]" />
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="assignee">Assignee</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className={cn('h-9 text-[12px] gap-1.5 border-[var(--color-mo-border-layout)]', showArchived && 'bg-[var(--color-mo-brand-surface)] text-[var(--color-mo-brand)] border-[var(--color-mo-info-border)]')}
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="w-3.5 h-3.5" />
            {showArchived ? 'Hide archived' : 'Show archived'}
          </Button>
          <div className="flex items-center bg-white border border-[var(--color-mo-border-layout)] rounded-lg overflow-hidden">
            <Button variant="ghost" size="sm" className={cn('p-2 h-auto transition-colors rounded-none', viewMode === 'list' ? 'bg-[var(--color-mo-brand-surface)] text-[var(--color-mo-brand)]' : 'text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-text-secondary)]')} onClick={() => setViewMode('list')}>
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className={cn('p-2 h-auto transition-colors rounded-none', viewMode === 'board' ? 'bg-[var(--color-mo-brand-surface)] text-[var(--color-mo-brand)]' : 'text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-text-secondary)]')} onClick={() => setViewMode('board')}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-hover)] text-white gap-2 shadow-sm">
                <Plus className="w-4 h-4" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle className="text-lg font-semibold">New Task</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" className="border-[var(--color-mo-border-layout)] focus:border-[var(--color-mo-brand)] focus:ring-[var(--color-mo-brand)]" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Project</Label>
                    <Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                      <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Assignee</Label>
                    <Select value={form.assigneeId} onValueChange={v => setForm({ ...form, assigneeId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger>
                      <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Priority</Label>
                    <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{['Low', 'Medium', 'High'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="border-[var(--color-mo-border-layout)] focus:border-[var(--color-mo-brand)] focus:ring-[var(--color-mo-brand)]" /></div>
                </div>
                <div className="space-y-1.5"><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Design, UI, Backend" className="border-[var(--color-mo-border-layout)] focus:border-[var(--color-mo-brand)] focus:ring-[var(--color-mo-brand)]" /></div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)} className="border-[var(--color-mo-border-layout)]">Cancel</Button>
                  <Button className="bg-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-hover)] text-white" onClick={handleCreate}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-[var(--color-mo-brand-surface)] border border-[var(--color-mo-info-border)] rounded-lg px-4 py-2.5">
          <span className="text-[13px] font-medium text-[var(--color-mo-info-text)]">{selectedIds.size} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Select onValueChange={handleBulkStatus}>
              <SelectTrigger className="h-7 text-[12px] bg-white border-[var(--color-mo-info-border)]"><SelectValue placeholder="Change status" /></SelectTrigger>
              <SelectContent>
                {['To Do', 'In Progress', 'Done'].map(s => <SelectItem key={s} value={s} className="text-[12px]">{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="h-7 text-[12px] text-[var(--color-mo-error-primary)] hover:bg-[var(--color-mo-error-surface)] gap-1" onClick={handleBulkDelete}>
              <Trash2 className="w-3 h-3" /> Delete
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-text-secondary)]" onClick={() => setSelectedIds(new Set())}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {Object.entries(grouped).map(([groupName, items]) => (
            <div key={groupName}>
              {groupBy !== 'none' && (
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-[var(--color-mo-text-secondary)]">{groupName}</h3>
                  <span className="text-[11px] text-[var(--color-mo-text-muted)] bg-[var(--color-mo-bg-ui)] px-2 py-0.5 rounded-full font-medium">{items.length}</span>
                </div>
              )}
              <div className="rounded-xl bg-white shadow-sm overflow-hidden border border-[var(--color-mo-border-layout)]">
                <Table className="text-sm">
                  <TableHeader className="bg-[var(--color-mo-bg-ui)]"><TableRow>
                    <TableHead className="px-3 py-3 w-10">
                      <Checkbox
                        checked={items.length > 0 && items.every(t => selectedIds.has(t.id))}
                        onCheckedChange={() => selectAll(items)}
                      />
                    </TableHead>
                    <TableHead className="px-3 py-3 text-left text-xs font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Task</TableHead>
                    <TableHead className="px-3 py-3 text-left text-xs font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Project</TableHead>
                    <TableHead className="px-3 py-3 text-left text-xs font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Assignee</TableHead>
                    <TableHead className="px-3 py-3 text-left text-xs font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Due</TableHead>
                    <TableHead className="px-3 py-3 text-left text-xs font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Priority</TableHead>
                    <TableHead className="px-3 py-3 text-left text-xs font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Status</TableHead>
                    <TableHead className="px-3 py-3 text-left text-xs font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Progress</TableHead>
                    <TableHead className="px-3 py-3 w-10"></TableHead>
                  </TableRow></TableHeader>
                  <TableBody className="divide-y divide-[var(--color-mo-border-layout)]">
                    {items.map(task => {
                      const sc = STATUS_CONFIG[task.status] || STATUS_CONFIG['To Do']
                      const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['Low']
                      return (
                        <TableRow key={task.id} className={cn("hover:bg-[var(--color-mo-brand-surface)]/20 transition-colors group", selectedIds.has(task.id) && "bg-[var(--color-mo-brand-surface)]/30")}>
                          <TableCell className="px-3 py-3.5" data-prevent-nav onClick={e => e.stopPropagation()}>
                            <Checkbox checked={selectedIds.has(task.id)} onCheckedChange={() => toggleSelection(task.id)} />
                          </TableCell>
                          <TableCell className="px-3 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                                task.status === 'Done' ? 'bg-[var(--color-mo-success-surface)]' : task.status === 'In Progress' ? 'bg-[var(--color-mo-info-surface)]' : 'border-2 border-[var(--color-mo-border-input)]'
                              )}>
                                {task.status === 'Done' && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-mo-success-primary)]" />}
                                {task.status === 'In Progress' && <div className="w-2 h-2 rounded-full bg-[var(--color-mo-brand)]" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                {editingId === task.id ? (
                                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                    <Input
                                      value={editValue}
                                      onChange={e => setEditValue(e.target.value)}
                                      className="h-7 text-[13px] border-[var(--color-mo-brand)] focus:ring-[var(--color-mo-brand)]"
                                      autoFocus
                                      onKeyDown={e => {
                                        if (e.key === 'Enter') saveInlineEdit(task.id)
                                        if (e.key === 'Escape') cancelInlineEdit()
                                      }}
                                      onBlur={() => saveInlineEdit(task.id)}
                                    />
                                  </div>
                                ) : (
                                  <span
                                    className={cn('font-medium cursor-text', task.status === 'Done' ? 'line-through text-[var(--color-mo-text-muted)]' : 'text-[var(--color-mo-text-primary)]')}
                                    onClick={(e) => {
                                      if (e.target.closest('[data-prevent-nav]')) return
                                      navigate(`/tasks/${task.id}`)
                                    }}
                                    onDoubleClick={() => startInlineEdit(task)}
                                    title="Double-click to edit"
                                  >
                                    {task.title}
                                  </span>
                                )}
                                <div className="flex gap-1 mt-1">
                                  {task.flagged && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-[var(--color-mo-error-surface)] text-[var(--color-mo-error-primary)] border border-[var(--color-mo-error-border)] flex items-center gap-0.5">
                                      <Flag className="w-2.5 h-2.5" /> Flagged
                                    </span>
                                  )}
                                  {task.archived && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-[var(--color-mo-bg-ui)] text-[var(--color-mo-text-muted)] border border-[var(--color-mo-border-layout)] flex items-center gap-0.5">
                                      <Archive className="w-2.5 h-2.5" /> Archived
                                    </span>
                                  )}
                                  {task.tags.map(tag => {
                                    const color = getLabelColor(tag)
                                    return (
                                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium border"
                                        style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}>
                                        {tag}
                                      </span>
                                    )
                                  })}
                                  {task.dependencies && task.dependencies.length > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium bg-[var(--color-mo-warning-surface)] text-[var(--color-mo-warning-primary)] border border-[var(--color-mo-warning-border)]">
                                      {task.dependencies.length} dependency{task.dependencies.length > 1 ? 'ies' : 'y'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-3.5 text-[var(--color-mo-text-muted)]">{getProject(task.projectId)?.name || '-'}</TableCell>
                          <TableCell className="px-3 py-3.5">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6"><AvatarFallback className="text-[9px] bg-gradient-to-br from-[var(--color-mo-info-surface)] to-[var(--color-mo-brand-surface)] text-[var(--color-mo-info-text)] font-semibold">{getUser(task.assigneeId)?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                              <span className="text-[var(--color-mo-text-muted)]">{getUser(task.assigneeId)?.name || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-3.5">
                            <span className={cn('text-[12px]', task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-[var(--color-mo-error-primary)] font-medium' : 'text-[var(--color-mo-text-placeholder)]')}>
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3.5">
                            <Badge className={cn('text-[10px] px-1.5 py-0 border font-medium', pc.badge)}>{task.priority}</Badge>
                          </TableCell>
                          <TableCell className="px-3 py-3.5" data-prevent-nav>
                            <Select value={task.status} onValueChange={(v) => handleStatusChange(task.id, v)}>
                              <SelectTrigger className={cn('h-6 text-[10px] font-medium border w-auto min-w-[100px] px-2', sc.badge)}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {['To Do', 'In Progress', 'Done'].map(s => (
                                  <SelectItem key={s} value={s} className="text-[12px]">{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="px-3 py-3.5">
                            <Progress value={task.completionPercent} className="w-16" />
                          </TableCell>
                          <TableCell className="px-3 py-3.5" data-prevent-nav>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className={cn('h-6 w-6 p-0', task.flagged ? 'text-[var(--color-mo-error-primary)]' : 'text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-error-primary)]')} onClick={() => { toggleTaskFlag(task.id); toast.success(task.flagged ? 'Flag removed' : 'Task flagged') }} title={task.flagged ? 'Remove flag' : 'Flag task'}>
                                <Flag className="w-3 h-3" />
                              </Button>
                              {task.archived ? (
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-brand)]" onClick={() => { unarchiveTask(task.id); toast.success('Task unarchived') }} title="Unarchive">
                                  <ArchiveRestore className="w-3 h-3" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-brand)]" onClick={() => { archiveTask(task.id); toast.success('Task archived') }} title="Archive">
                                  <Archive className="w-3 h-3" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-brand)]" onClick={() => handleDuplicate(task.id)} title="Duplicate">
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <KanbanBoard tasks={filtered} projects={projects} users={users} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}

function groupTasks(tasks, key, resolver) {
  return tasks.reduce((acc, t) => {
    const val = t[key]
    const name = resolver(val)?.name || val || 'Unassigned'
    if (!acc[name]) acc[name] = []
    acc[name].push(t)
    return acc
  }, {})
}

function KanbanBoard({ tasks, projects, users, onStatusChange }) {
  const navigate = useNavigate()
  const columns = [
    { key: 'To Do', icon: Circle, headerBg: 'bg-[var(--color-mo-bg-ui)]', headerText: 'text-[var(--color-mo-text-secondary)]', dotColor: 'bg-[var(--color-mo-text-placeholder)]' },
    { key: 'In Progress', icon: Clock, headerBg: 'bg-[var(--color-mo-info-surface)]', headerText: 'text-[var(--color-mo-info-text)]', dotColor: 'bg-[var(--color-mo-brand)]' },
    { key: 'Done', icon: CheckCircle2, headerBg: 'bg-[var(--color-mo-success-surface)]', headerText: 'text-[var(--color-mo-success-text)]', dotColor: 'bg-[var(--color-mo-success-primary)]' },
  ]
  const getUser = id => users.find(u => u.id === id)
  const getProject = id => projects.find(p => p.id === id)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col, colIdx) => {
        const ColIcon = col.icon
        const colTasks = tasks.filter(t => t.status === col.key)
        return (
          <div key={col.key} className="bg-[var(--color-mo-bg-ui)]/50 rounded-xl p-3 border border-[var(--color-mo-border-layout)]">
            <div className={cn('flex items-center justify-between mb-3 px-2 py-2 rounded-lg', col.headerBg)}>
              <div className="flex items-center gap-2">
                <div className={cn('w-2.5 h-2.5 rounded-full', col.dotColor)} />
                <h3 className={cn('text-sm font-semibold', col.headerText)}>{col.key}</h3>
              </div>
              <span className="text-[11px] font-medium text-[var(--color-mo-text-muted)] bg-white px-2 py-0.5 rounded-full shadow-sm">{colTasks.length}</span>
            </div>
            <div className="space-y-2">
              {colTasks.map(task => {
                const priorityConf = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['Low']
                return (
                  <Card key={task.id} className="shadow-sm cursor-pointer hover:shadow-md transition-all border-0 bg-white group"
                    onClick={() => navigate(`/tasks/${task.id}`)}>
                    <CardContent className="p-3.5 space-y-2.5">
                      <p className={cn('text-sm font-medium', task.status === 'Done' ? 'line-through text-[var(--color-mo-text-muted)]' : 'text-[var(--color-mo-text-primary)]')}>{task.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn('text-[9px] px-1.5 py-0 border font-medium', priorityConf.badge)}>{task.priority}</Badge>
                        {task.tags.slice(0, 2).map(tag => {
                          const color = getLabelColor(tag)
                          return (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md font-medium border"
                              style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}>
                              {tag}
                            </span>
                          )
                        })}
                        {task.dependencies && task.dependencies.length > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-medium bg-[var(--color-mo-warning-surface)] text-[var(--color-mo-warning-primary)] border border-[var(--color-mo-warning-border)]">
                            {task.dependencies.length} dep
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="w-5 h-5"><AvatarFallback className="text-[8px] bg-gradient-to-br from-[var(--color-mo-info-surface)] to-[var(--color-mo-brand-surface)] text-[var(--color-mo-info-text)] font-semibold">{getUser(task.assigneeId)?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                          {task.dueDate && (
                            <span className={cn('text-[10px]', new Date(task.dueDate) < new Date() ? 'text-[var(--color-mo-error-primary)] font-medium' : 'text-[var(--color-mo-text-placeholder)]')}>
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          {colIdx > 0 && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-surface)]" onClick={() => onStatusChange(task.id, columns[colIdx - 1].key)}>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {colIdx < columns.length - 1 && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-surface)]" onClick={() => onStatusChange(task.id, columns[colIdx + 1].key)}>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {colTasks.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-[var(--color-mo-border-layout)] rounded-xl">
                  <ColIcon className="w-6 h-6 text-[var(--color-mo-text-placeholder)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--color-mo-text-muted)] font-medium">No tasks</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
