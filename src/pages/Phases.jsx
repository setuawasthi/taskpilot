import { useState } from 'react'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Layers, Search } from 'lucide-react'

const statusBadge = {
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC]',
  'Not Started': 'bg-gray-50 text-gray-500 border-gray-200',
}

export default function Phases() {
  const { phases, projects, users, createPhase } = useData()
  const [query, setQuery] = useState('')
  const [filterProject, setFilterProject] = useState('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', projectId: '', status: 'Not Started', ownerId: '', startDate: '', endDate: '' })

  const getUser = id => users.find(u => u.id === id)
  const getProject = id => projects.find(p => p.id === id)

  let filtered = phases.filter(ph => ph.name.toLowerCase().includes(query.toLowerCase()))
  if (filterProject !== 'all') filtered = filtered.filter(ph => ph.projectId === filterProject)

  const handleCreate = () => {
    if (!form.name.trim() || !form.projectId) return
    createPhase({ ...form, progress: 0 })
    toast.success('Phase created')
    setForm({ name: '', projectId: '', status: 'Not Started', ownerId: '', startDate: '', endDate: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-5 lg:px-8 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phases</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage project milestones and phases.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search phases..."
              className="pl-9 h-9 w-56 bg-white border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-40 h-9 bg-white border-gray-200 focus:ring-[#6366F1]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white gap-2 focus:ring-[#6366F1]">
                <Plus className="w-4 h-4" /> Add Phase
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900">Add Phase</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-gray-700">Phase Name</Label>
                  <Input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Discovery"
                    className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-700">Project</Label>
                    <Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })}>
                      <SelectTrigger className="border-gray-200 focus:ring-[#6366F1]">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-700">Owner</Label>
                    <Select value={form.ownerId} onValueChange={v => setForm({ ...form, ownerId: v })}>
                      <SelectTrigger className="border-gray-200 focus:ring-[#6366F1]">
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                      <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-700">Start Date</Label>
                    <Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-700">End Date</Label>
                    <Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" className="border-gray-200 text-gray-700" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white focus:ring-[#6366F1]" onClick={handleCreate}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-white shadow-sm border-0 overflow-hidden rounded-lg">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phase</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {filtered.map(ph => (
              <TableRow key={ph.id} className="hover:bg-[#EEF2FF]/20 transition-colors">
                <TableCell className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#6366F1]" />
                    <span className="font-medium text-gray-900">{ph.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3.5 text-gray-600">{getProject(ph.projectId)?.name || '-'}</TableCell>
                <TableCell className="px-5 py-3.5 text-gray-600">{getUser(ph.ownerId)?.name || '-'}</TableCell>
                <TableCell className="px-5 py-3.5 text-gray-400">{ph.startDate ? new Date(ph.startDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell className="px-5 py-3.5 text-gray-400">{ph.endDate ? new Date(ph.endDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell className="px-5 py-3.5">
                  <Badge variant="outline" className={cn('text-xs border', statusBadge[ph.status] || statusBadge['Not Started'])}>
                    {ph.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-3.5">
                  <Progress value={ph.progress} className="w-24" />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">No phases found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}