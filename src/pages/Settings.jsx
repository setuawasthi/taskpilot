import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useData } from '@/context/DataContext'
import { User, Bell, Lock, Camera, Calendar, FileText, Shield } from 'lucide-react'

export default function SettingsPage() {
  const { currentUser } = useData()
  const [notifSettings, setNotifSettings] = useState({ email: true, push: true, mentions: true, deadlines: true })
  const [profile, setProfile] = useState({ name: currentUser.name, email: currentUser.email })

  const handleSaveProfile = () => {
    toast.success('Profile updated')
  }

  return (
    <div className="px-5 lg:px-8 py-5 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-[17px] font-semibold text-[#1D2129]">Settings</h1>
            <p className="text-[13px] text-[#919BA8] mt-0.5">Manage your account and preferences.</p>
          </div>

          {/* Profile */}
          <Card>
            <CardHeader className="px-5 py-4 border-b border-[#E8EAED] flex flex-row items-center gap-2">
              <User className="w-4 h-4 text-[#6366F1]" />
              <CardTitle className="text-[13px] font-semibold text-[#1D2129]">Profile</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="text-base bg-gradient-to-br from-[#6366F1] to-[#818CF8] text-white font-semibold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="gap-2 border-[#E8EAED] text-[13px]">
                  <Camera className="w-4 h-4" /> Change Photo
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#5E6878]">Name</Label>
                  <Input
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="h-8 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#5E6878]">Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="h-8 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-md"
                  />
                </div>
              </div>
              <Button className="h-8 text-[13px] bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md shadow-none" onClick={handleSaveProfile}>Save Profile</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="px-5 py-4 border-b border-[#E8EAED] flex flex-row items-center gap-2">
              <Bell className="w-4 h-4 text-[#6366F1]" />
              <CardTitle className="text-[13px] font-semibold text-[#1D2129]">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 space-y-4">
              {[
                { key: 'email', label: 'Email notifications', desc: 'Receive summary emails' },
                { key: 'push', label: 'Push notifications', desc: 'Real-time browser alerts' },
                { key: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                { key: 'deadlines', label: 'Deadline reminders', desc: 'Upcoming due dates' },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-[#1D2129]">{item.label}</p>
                      <p className="text-[12px] text-[#919BA8]">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifSettings[item.key]}
                      onCheckedChange={v => setNotifSettings(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                  {i < arr.length - 1 && <Separator className="bg-[#E8EAED] mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader className="px-5 py-4 border-b border-[#E8EAED] flex flex-row items-center gap-2">
              <Lock className="w-4 h-4 text-[#6366F1]" />
              <CardTitle className="text-[13px] font-semibold text-[#1D2129]">Security</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#5E6878]">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-8 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#5E6878]">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-8 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-md" />
                </div>
              </div>
              <Button variant="outline" className="h-8 text-[13px] border-[#E8EAED] rounded-md">Change Password</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-[10px] font-semibold text-[#919BA8] uppercase tracking-wider mb-3">Account Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#919BA8]" />
                <div>
                  <p className="text-[11px] text-[#919BA8]">Role</p>
                  <p className="text-[13px] font-medium text-[#1D2129]">Admin</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#919BA8]" />
                <div>
                  <p className="text-[11px] text-[#919BA8]">Joined</p>
                  <p className="text-[13px] font-medium text-[#1D2129]">Apr 28, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#919BA8]" />
                <div>
                  <p className="text-[11px] text-[#919BA8]">Plan</p>
                  <p className="text-[13px] font-medium text-[#1D2129]">Pro</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
