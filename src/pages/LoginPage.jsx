import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Sparkles, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    toast.success('Welcome back!')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-6 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-[15px] font-semibold text-[#1A1D23]">TaskPilot</span>
            </div>
            <h1 className="text-[24px] font-bold text-[#1A1D23] mb-2">Welcome back</h1>
            <p className="text-[14px] text-[#5E6878]">Sign in to continue to your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#5E6878]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8BFC7]" />
                <Input type="email" placeholder="you@company.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="pl-10 h-10 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] text-[#5E6878]">Password</Label>
                <button type="button" className="text-[12px] text-[#6366F1] hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8BFC7]" />
                <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="pl-10 pr-10 h-10 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-lg" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8BFC7] hover:text-[#5E6878]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg text-[13px] font-medium gap-2">
              Sign in <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-[13px] text-[#919BA8] mt-6">
            Do not have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-[#6366F1] font-medium hover:underline">Sign up</button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-[#0F1117] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6366F1] rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#818CF8] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-white max-w-md px-12">
          <blockquote className="text-[20px] font-medium leading-relaxed mb-6">
            TaskPilot has transformed how our team manages projects. We ship faster and stay aligned.
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center text-[14px] font-semibold">JD</div>
            <div>
              <p className="text-[14px] font-medium">John Doe</p>
              <p className="text-[12px] text-white/60">Product Manager at Acme Inc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
