import { useNavigate } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import {
  FolderKanban,
  Plus,
  Calendar,
  LayoutGrid,
  List,
  Search,
  CheckCircle2,
  Clock,
  Circle,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { useState } from 'react'

const STATUS_CONFIG = {
  'Active': { dot: 'bg-[var(--color-mo-brand)]', text: 'text-[var(--color-mo-info-text)]', bg: 'bg-[var(--color-mo-info-surface)]', border: 'border-[var(--color-mo-info-border)]' },
  'Completed': { dot: 'bg-[var(--color-mo-success-primary)]', text: 'text-[var(--color-mo-success-text)]', bg: 'bg-[var(--color-mo-success-surface)]', border: 'border-[var(--color-mo-success-border)]' },
  'On Hold': { dot: 'bg-[var(--color-mo-warning-primary)]', text: 'text-[var(--color-mo-warning-text)]', bg: 'bg-[var(--color-mo-warning-surface)]', border: 'border-[var(--color-mo-warning-border)]' },
}

export default function Projects() {
  const { projects, users, tasks, createProject } = useData()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('grid')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', status: 'Active', ownerId: '', startDate: '', endDate: '' })

  const filtered = projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
  const getUser = (id) => users.find(u => u.id === id)
  const taskCount = (pid) => tasks.filter(t => t.projectId === pid).length
  const doneCount = (pid) => tasks.filter(t => t.projectId === pid && t.status === 'Done').length
  const getProjectMembers = (pid) => {
    const p = projects.find(pr => pr.id === pid)
    if (!p) return []
    return p.teamMemberIds.map(id => users.find(u => u.id === id)).filter(Boolean)
  }

  const handleCreate = () => {
    if (!form.name.trim()) return
    createProject({ ...form, teamMemberIds: [form.ownerId].filter(Boolean) })
    toast.success('Project created')
    setForm({ name: '', description: '', status: 'Active', ownerId: '', startDate: '', endDate: '' })
    setOpen(false)
  }

  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}`)
  }

  return (
    <div className="px-5 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--color-mo-text-primary)]">Projects</h1>
          <p className="text-[13px] text-[var(--color-mo-text-muted)] mt-0.5">{projects.length} total projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-mo-text-placeholder)]" />
            <Input placeholder="Search projects..." className="pl-8 h-8 w-52 text-[13px] bg-white border-[var(--color-mo-border-layout)] focus:border-[var(--color-mo-brand)] focus:ring-1 focus:ring-[var(--color-mo-brand)]/20 rounded-md" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center border border-[var(--color-mo-border-layout)] rounded-md overflow-hidden">
            <Button variant="ghost" size="sm" className={cn('p-1.5 h-auto rounded-none transition-colors', viewMode === 'grid' ? 'bg-[var(--color-mo-brand-surface)] text-[var(--color-mo-brand)]' : 'text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-text-secondary)]')} onClick={() => setViewMode('grid')}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className={cn('p-1.5 h-auto rounded-none transition-colors', viewMode === 'list' ? 'bg-[var(--color-mo-brand-surface)] text-[var(--color-mo-brand)]' : 'text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-text-secondary)]')} onClick={() => setViewMode('list')}>
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-8 gap-1.5 rounded-md bg-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-hover)] text-white text-[13px] font-medium shadow-none">
                <Plus className="w-3.5 h-3.5" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-[15px] font-semibold text-[var(--color-mo-text-primary)]">Create Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[var(--color-mo-text-secondary)]">Project Name</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Website Redesign" className="h-8 text-[13px] border-[var(--color-mo-border-layout)] focus:border-[var(--color-mo-brand)] focus:ring-1 focus:ring-[var(--color-mo-brand)]/20 rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[var(--color-mo-text-secondary)]">Description</Label>
                  <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" className="text-[13px] border-[var(--color-mo-border-layout)] focus:border-[var(--color-mo-brand)] focus:ring-1 focus:ring-[var(--color-mo-brand)]/20 rounded-md" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] text-[var(--color-mo-text-secondary)]">Owner</Label>
                    <Select value={form.ownerId} onValueChange={v => setForm({ ...form, ownerId: v })}>
                      <SelectTrigger className="h-8 text-[13px] border-[var(--color-mo-border-layout)] rounded-md"><SelectValue placeholder="Select owner" /></SelectTrigger>
                      <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] text-[var(--color-mo-text-secondary)]">Status</Label>
                    <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                      <SelectTrigger className="h-8 text-[13px] border-[var(--color-mo-border-layout)] rounded-md"><SelectValue /></SelectTrigger>
                      <SelectContent>{['Active', 'Completed', 'On Hold'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] text-[var(--color-mo-text-secondary)]">Start Date</Label>
                    <Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="h-8 text-[13px] border-[var(--color-mo-border-layout)] rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] text-[var(--color-mo-text-secondary)]">End Date</Label>
                    <Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="h-8 text-[13px] border-[var(--color-mo-border-layout)] rounded-md" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)} className="h-8 text-[13px] border-[var(--color-mo-border-layout)] rounded-md">Cancel</Button>
                  <Button className="h-8 bg-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-hover)] text-[13px] rounded-md shadow-none" onClick={handleCreate}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => {
            const owner = getUser(project.ownerId)
            const tCount = taskCount(project.id)
            const dCount = doneCount(project.id)
            const members = getProjectMembers(project.id)
            const sc = STATUS_CONFIG[project.status] || STATUS_CONFIG['Active']
            return (
              <Card
                key={project.id}
                className="cursor-pointer group hover:shadow-md transition-all duration-200 border border-[var(--color-mo-border-layout)] bg-white"
                onClick={() => handleCardClick(project.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-mo-bg-ui)] flex items-center justify-center">
                        <FolderKanban className="w-5 h-5 text-[var(--color-mo-text-muted)]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[14px] font-semibold text-[var(--color-mo-text-primary)] group-hover:text-[var(--color-mo-brand)] transition-colors leading-tight truncate">{project.name}</h3>
                        <p className="text-[11px] text-[var(--color-mo-text-muted)] mt-0.5">{owner?.name || 'No owner'}</p>
                      </div>
                    </div>
                    <span className={cn('text-[11px] px-2 py-0.5 rounded-md font-medium border', sc.bg, sc.text, sc.border)}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--color-mo-text-secondary)] line-clamp-2 mb-4">{project.description}</p>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-[var(--color-mo-text-muted)]">{dCount}/{tCount} tasks</span>
                      <span className="font-medium text-[var(--color-mo-text-secondary)]">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="w-full h-1.5" />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-mo-border-layout)]">
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-mo-text-muted)]">
                      <Calendar className="w-3 h-3" />
                      <span>{project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            {members.slice(0, 3).map((m, i) => (
                              <Avatar key={m.id} className={cn('w-5 h-5 border-2 border-white', i > 0 && '-ml-1.5')}>
                                <AvatarFallback className="text-[8px] bg-[var(--color-mo-primary)] text-white font-medium">
                                  {m.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {members.length > 3 && (
                              <span className="w-5 h-5 rounded-full bg-[var(--color-mo-bg-ui)] text-[8px] font-medium text-[var(--color-mo-text-secondary)] flex items-center justify-center -ml-1.5 border-2 border-white">+{members.length - 3}</span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{members.map(m => m.name).join(', ')}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="overflow-hidden border border-[var(--color-mo-border-layout)] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--color-mo-border-layout)] hover:bg-transparent">
                <TableHead className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Project</TableHead>
                <TableHead className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Progress</TableHead>
                <TableHead className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Owner</TableHead>
                <TableHead className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Deadline</TableHead>
                <TableHead className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">Tasks</TableHead>
                <TableHead className="px-4 py-3 w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(project => {
                const owner = getUser(project.ownerId)
                const sc = STATUS_CONFIG[project.status] || STATUS_CONFIG['Active']
                return (
                  <TableRow key={project.id} className="border-b border-[var(--color-mo-border-layout)] hover:bg-[var(--color-mo-bg-ui)] transition-colors cursor-pointer group" onClick={() => handleCardClick(project.id)}>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-[var(--color-mo-bg-ui)] flex items-center justify-center shrink-0">
                          <FolderKanban className="w-4 h-4 text-[var(--color-mo-text-muted)]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-[var(--color-mo-text-primary)] group-hover:text-[var(--color-mo-brand)] transition-colors truncate">{project.name}</p>
                          <p className="text-[11px] text-[var(--color-mo-text-muted)] truncate max-w-[200px]">{project.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className={cn('text-[11px] px-2 py-0.5 rounded-md font-medium border', sc.bg, sc.text, sc.border)}>
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="w-28">
                        <Progress value={project.progress} className="w-full h-1.5" />
                        <span className="text-[11px] text-[var(--color-mo-text-muted)] mt-1 block">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-[8px] bg-[var(--color-mo-primary)] text-white font-medium">
                            {owner?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[13px] text-[var(--color-mo-text-secondary)]">{owner?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[13px] text-[var(--color-mo-text-muted)]">{project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</TableCell>
                    <TableCell className="px-4 py-3 text-[13px] text-[var(--color-mo-text-secondary)]">{taskCount(project.id)}</TableCell>
                    <TableCell className="px-4 py-3">
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--color-mo-text-placeholder)]" />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-[var(--color-mo-bg-ui)] flex items-center justify-center mx-auto mb-3">
            <FolderKanban className="w-6 h-6 text-[var(--color-mo-text-placeholder)]" />
          </div>
          <p className="text-[13px] font-medium text-[var(--color-mo-text-secondary)]">No projects found</p>
          <p className="text-[12px] text-[var(--color-mo-text-muted)] mt-1">Create a new project to get started.</p>
        </div>
      )}
    </div>
  )
}
