import { useState } from 'react'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Users, Plus, Mail, Shield, Search } from 'lucide-react'

export default function Team() {
  const { users, inviteUser, updateUserRole } = useData()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'Member' })

  const filtered = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))

  const handleInvite = () => {
    if (!form.name.trim() || !form.email.trim()) return
    inviteUser({ ...form })
    toast.success('Team member invited')
    setForm({ name: '', email: '', role: 'Member' })
    setOpen(false)
  }

  const roleColor = role =>
    role === 'Admin'
      ? 'bg-red-50 text-red-600 border-red-200'
      : role === 'Manager'
        ? 'bg-[#EEF2FF] text-[#4338CA] border-[#A5B4FC]'
        : 'bg-gray-50 text-gray-500 border-gray-200'

  const statusColor = status =>
    status === 'Active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-amber-50 text-amber-600 border-amber-200'

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-5 lg:px-8 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage members and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              className="pl-9 h-9 w-56 bg-white border-gray-200 focus:border-[#6366F1]"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white gap-2">
                <Plus className="w-4 h-4" /> Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Invite Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input
                    className="border-gray-200 focus:border-[#6366F1]"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    className="border-gray-200 focus:border-[#6366F1]"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                    <SelectTrigger className="border-gray-200 focus:border-[#6366F1]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Admin', 'Manager', 'Member'].map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white" onClick={handleInvite}>Invite</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {filtered.map(u => (
              <TableRow key={u.id} className="hover:bg-[#EEF2FF]/20 transition-colors">
                <TableCell className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF] text-[#4338CA] font-semibold">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{u.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3.5">
                  <Badge variant="outline" className={cn('text-xs', roleColor(u.role))}>{u.role}</Badge>
                </TableCell>
                <TableCell className="px-5 py-3.5 text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {u.email}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3.5">
                  <Badge variant="outline" className={cn('text-xs', statusColor(u.status))}>{u.status}</Badge>
                </TableCell>
                <TableCell className="px-5 py-3.5">
                  <Select value={u.role} onValueChange={v => updateUserRole(u.id, v)}>
                    <SelectTrigger className="h-8 w-28 border-gray-200 focus:border-[#6366F1]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Admin', 'Manager', 'Member'].map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}