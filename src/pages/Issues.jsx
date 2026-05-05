import { useState } from 'react'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, AlertCircle, Search } from 'lucide-react'

export default function Issues() {
  const { issues, projects, users, createIssue } = useData()
  const [query, setQuery] = useState('')
  const [filterProject, setFilterProject] = useState('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', projectId: '', severity: 'Medium', status: 'Open', assigneeId: '', reporterId: users[0]?.id, dueDate: '' })

  const getUser = id => users.find(u => u.id === id)
  const getProject = id => projects.find(p => p.id === id)

  let filtered = issues.filter(i => i.title.toLowerCase().includes(query.toLowerCase()))
  if (filterProject !== 'all') filtered = filtered.filter(i => i.projectId === filterProject)

  const handleCreate = () => {
    if (!form.title.trim() || !form.projectId) return
    createIssue({ ...form, reporterId: users[0].id })
    toast.success('Issue submitted')
    setForm({ title: '', projectId: '', severity: 'Medium', status: 'Open', assigneeId: '', reporterId: users[0]?.id, dueDate: '' })
    setOpen(false)
  }

  const severityBadge = severity => {
    if (severity === 'Critical') return 'bg-red-50 text-red-600 border-red-200'
    if (severity === 'High') return 'bg-amber-50 text-amber-600 border-amber-200'
    if (severity === 'Medium') return 'bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC]'
    return 'bg-gray-50 text-gray-500 border-gray-200'
  }

  const statusBadge = status => {
    if (status === 'Closed' || status === 'Resolved') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (status === 'In Progress') return 'bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC]'
    if (status === 'Open') return 'bg-amber-50 text-amber-600 border-amber-200'
    return 'bg-gray-50 text-gray-500 border-gray-200'
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-5 lg:px-8 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track bugs and defects across projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search issues..." className="pl-9 h-9 w-56 bg-white border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-40 h-9 bg-white border-gray-200"><SelectValue placeholder="All Projects" /></SelectTrigger>
            <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}<SelectItem value="all">All Projects</SelectItem></SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white gap-2">
                <Plus className="w-4 h-4" /> Submit Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle className="text-lg font-bold text-gray-900">Submit Issue</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label>Issue Name</Label><Input className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Describe the issue" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Project</Label>
                    <Select value={form.projectId} onValueChange={v => setForm({...form, projectId: v})}>
                      <SelectTrigger className="border-gray-200 focus:ring-[#6366F1]"><SelectValue placeholder="Select project" /></SelectTrigger>
                      <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Severity</Label>
                    <Select value={form.severity} onValueChange={v => setForm({...form, severity: v})}>
                      <SelectTrigger className="border-gray-200 focus:ring-[#6366F1]"><SelectValue /></SelectTrigger>
                      <SelectContent>{['Low','Medium','High','Critical'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label>Assignee</Label>
                    <Select value={form.assigneeId} onValueChange={v => setForm({...form, assigneeId: v})}>
                      <SelectTrigger className="border-gray-200 focus:ring-[#6366F1]"><SelectValue placeholder="Select assignee" /></SelectTrigger>
                      <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" className="border-gray-200" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white" onClick={handleCreate}>Submit</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/80"><TableRow>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reporter</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
            </TableRow></TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {filtered.map(i => (
                <TableRow key={i.id} className="hover:bg-[#EEF2FF]/20 transition-colors">
                  <TableCell className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{i.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-gray-600">{getProject(i.projectId)?.name || '-'}</TableCell>
                  <TableCell className="px-5 py-3.5 text-gray-600">{getUser(i.reporterId)?.name || '-'}</TableCell>
                  <TableCell className="px-5 py-3.5 text-gray-600">{getUser(i.assigneeId)?.name || '-'}</TableCell>
                  <TableCell className="px-5 py-3.5 text-gray-400">{i.dueDate ? new Date(i.dueDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="px-5 py-3.5">
                    <Badge variant="outline" className={cn('text-xs', severityBadge(i.severity))}>{i.severity}</Badge>
                  </TableCell>
                  <TableCell className="px-5 py-3.5">
                    <Badge variant="outline" className={cn('text-xs', statusBadge(i.status))}>{i.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">No issues found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}