import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Sparkles, ArrowRight, Mail, Lock, Eye, EyeOff, User, Building2 } from 'lucide-react'

export default function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' })

  const handleNext = () => {
    if (step === 1 && (!form.name.trim() || !form.email.trim())) {
      toast.error('Please fill in all fields')
      return
    }
    if (step === 2 && !form.password.trim()) {
      toast.error('Please enter a password')
      return
    }
    if (step < 3) setStep(step + 1)
  }

  const handleSubmit = () => {
    toast.success('Account created! Welcome to TaskPilot.')
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
            <h1 className="text-[24px] font-bold text-[#1A1D23] mb-2">
              {step === 1 && 'Create your account'}
              {step === 2 && 'Set a password'}
              {step === 3 && 'Tell us about your team'}
            </h1>
            <p className="text-[14px] text-[#5E6878]">
              {step === 1 && 'Start your free trial today.'}
              {step === 2 && 'Keep your account secure.'}
              {step === 3 && 'We will personalize your experience.'}
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[#6366F1]' : 'bg-[#E8EAED]'}`} />
            ))}
          </div>

          <div className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#5E6878]">Full name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8BFC7]" />
                    <Input placeholder="John Doe" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="pl-10 h-10 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-lg" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#5E6878]">Work email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8BFC7]" />
                    <Input type="email" placeholder="you@company.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="pl-10 h-10 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-lg" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-1.5">
                <Label className="text-[13px] text-[#5E6878]">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8BFC7]" />
                  <Input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="pl-10 pr-10 h-10 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-lg" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8BFC7] hover:text-[#5E6878]">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#919BA8]">Must be at least 8 characters with a number and symbol.</p>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#5E6878]">Company name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8BFC7]" />
                    <Input placeholder="Acme Inc." value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                      className="pl-10 h-10 text-[13px] border-[#E8EAED] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 rounded-lg" />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#F8F9FB] border border-[#E8EAED]">
                  <p className="text-[12px] text-[#5E6878] leading-relaxed">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}
                  className="flex-1 h-10 border-[#E8EAED] text-[13px] text-[#5E6878] rounded-lg">
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={handleNext}
                  className="flex-1 h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg text-[13px] font-medium gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}
                  className="flex-1 h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg text-[13px] font-medium gap-2">
                  Create account <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <p className="text-center text-[13px] text-[#919BA8] mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-[#6366F1] font-medium hover:underline">Sign in</button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-[#0F1117] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6366F1] rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#818CF8] rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-white max-w-md px-12">
          <div className="space-y-6">
            {[
              { label: 'Tasks managed', value: '10,000+' },
              { label: 'Active teams', value: '2,500+' },
              { label: 'Countries', value: '40+' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-[14px] text-white/60">{stat.label}</span>
                <span className="text-[18px] font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
