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
import { Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

export default function TimeLogs() {
  const { timeLogs, projects, tasks, users, createTimeLog, currentUser } = useData()
  const [weekOffset, setWeekOffset] = useState(0)
  const [filterUser, setFilterUser] = useState('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', projectId: '', taskId: '', dailyLogHours: '', date: new Date().toISOString().split('T')[0], billingType: 'Billable', notes: '' })

  const getUser = id => users.find(u => u.id === id)
  const getProject = id => projects.find(p => p.id === id)

  const startOfWeek = (d) => { const x = new Date(d); const day = x.getDay(); x.setDate(x.getDate() - day + weekOffset * 7); x.setHours(0,0,0,0); return x }
  const endOfWeek = (d) => { const x = startOfWeek(d); x.setDate(x.getDate() + 6); x.setHours(23,59,59,999); return x }
  const sow = startOfWeek(new Date())
  const eow = endOfWeek(new Date())

  let filtered = timeLogs.filter(tl => {
    const d = new Date(tl.date)
    return d >= sow && d <= eow
  })
  if (filterUser !== 'all') filtered = filtered.filter(tl => tl.userId === filterUser)

  const weekLabel = `${sow.toLocaleDateString()} - ${eow.toLocaleDateString()}`

  const handleCreate = () => {
    if (!form.title.trim() || !form.projectId || !form.dailyLogHours) return
    createTimeLog({ ...form, dailyLogHours: Number(form.dailyLogHours), userId: currentUser.id })
    toast.success('Time log added')
    setForm({ title: '', projectId: '', taskId: '', dailyLogHours: '', date: new Date().toISOString().split('T')[0], billingType: 'Billable', notes: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-5 lg:px-8 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track hours spent on projects and tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
            <Button variant="ghost" size="sm" className="p-2 h-auto rounded-none hover:bg-[#EEF2FF] text-gray-500" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="px-3 text-sm font-medium text-gray-900">{weekLabel}</span>
            <Button variant="ghost" size="sm" className="p-2 h-auto rounded-none hover:bg-[#EEF2FF] text-gray-500" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight className="w-4 h-4" /></Button>
          </div>
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger className="w-36 h-9 bg-white border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]"><SelectValue placeholder="All Users" /></SelectTrigger>
            <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}<SelectItem value="all">All Users</SelectItem></SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white gap-2 focus:ring-[#6366F1]">
                <Plus className="w-4 h-4" /> Add Time Log
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg border-gray-200">
              <DialogHeader><DialogTitle className="text-lg font-semibold text-gray-900">Add Time Log</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5"><Label className="text-gray-700">Log Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="What did you work on?" className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label className="text-gray-700">Project</Label>
                    <Select value={form.projectId} onValueChange={v => setForm({...form, projectId: v})}>
                      <SelectTrigger className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]"><SelectValue placeholder="Select project" /></SelectTrigger>
                      <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-gray-700">Task (optional)</Label>
                    <Select value={form.taskId} onValueChange={v => setForm({...form, taskId: v})}>
                      <SelectTrigger className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]"><SelectValue placeholder="Select task" /></SelectTrigger>
                      <SelectContent>{tasks.filter(t => !form.projectId || t.projectId === form.projectId).map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5"><Label className="text-gray-700">Hours</Label><Input type="number" min="0" step="0.5" value={form.dailyLogHours} onChange={e => setForm({...form, dailyLogHours: e.target.value})} className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-700">Date</Label><Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-700">Billing</Label>
                    <Select value={form.billingType} onValueChange={v => setForm({...form, billingType: v})}>
                      <SelectTrigger className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Billable">Billable</SelectItem><SelectItem value="Non-Billable">Non-Billable</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5"><Label className="text-gray-700">Notes</Label><Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Optional notes" className="border-gray-200 focus:border-[#6366F1] focus:ring-[#6366F1]" /></div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" className="border-gray-200" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white focus:ring-[#6366F1]" onClick={handleCreate}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-sm border-0 overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50/80"><TableRow>
            <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</TableHead>
            <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</TableHead>
            <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</TableHead>
            <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</TableHead>
            <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</TableHead>
            <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Billing</TableHead>
            <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</TableHead>
          </TableRow></TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {filtered.map(tl => (
              <TableRow key={tl.id} className="hover:bg-[#EEF2FF]/20 transition-colors">
                <TableCell className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{tl.title}</span>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3.5 text-gray-600">{getProject(tl.projectId)?.name || '-'}</TableCell>
                <TableCell className="px-5 py-3.5 text-gray-600">{getUser(tl.userId)?.name || '-'}</TableCell>
                <TableCell className="px-5 py-3.5 text-gray-500">{new Date(tl.date).toLocaleDateString()}</TableCell>
                <TableCell className="px-5 py-3.5 font-semibold text-gray-900">{tl.dailyLogHours}h</TableCell>
                <TableCell className="px-5 py-3.5">
                  <Badge variant="outline" className={cn("text-xs", tl.billingType === 'Billable' ? "bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC]" : "bg-gray-50 text-gray-500 border-gray-200")}>{tl.billingType}</Badge>
                </TableCell>
                <TableCell className="px-5 py-3.5 text-gray-400 text-xs">{tl.notes || '-'}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">No time logs for this week.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}