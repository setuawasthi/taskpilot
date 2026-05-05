import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  CheckSquare,
  FolderKanban,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
  Clock,
  CalendarDays,
  Shield,
  Sparkles,
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E8EAED]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold text-[#1A1D23]">TaskPilot</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-[13px] text-[#5E6878] hover:text-[#1A1D23]" onClick={() => navigate('/login')}>
              Log in
            </Button>
            <Button className="text-[13px] bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg px-4" onClick={() => navigate('/signup')}>
              Get started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF2FF] text-[#6366F1] text-[12px] font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Now with AI-powered insights
          </div>
          <h1 className="text-[48px] md:text-[64px] font-bold text-[#1A1D23] leading-[1.1] tracking-tight mb-6">
            One platform for<br />
            <span className="text-[#6366F1]">everything</span> you do
          </h1>
          <p className="text-[18px] text-[#5E6878] max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskPilot brings together tasks, projects, docs, and goals — 
            so your team can collaborate seamlessly and ship faster.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl px-8 h-12 text-[14px] font-medium gap-2"
              onClick={() => navigate('/signup')}
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-8 h-12 text-[14px] font-medium border-[#E8EAED] text-[#5E6878]"
              onClick={() => navigate('/login')}
            >
              View demo
            </Button>
          </div>
          <p className="text-[12px] text-[#919BA8] mt-4">Free forever. No credit card required.</p>
        </div>
      </section>

      {/* App Preview */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-[#E8EAED] shadow-2xl shadow-[#6366F1]/5 overflow-hidden bg-white">
            <div className="h-8 bg-[#F8F9FB] border-b border-[#E8EAED] flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E64646]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#E5A117]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#2F9E58]" />
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-[#6366F1]" />
                  <div className="h-3 w-24 bg-[#E8EAED] rounded" />
                </div>
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[#E8EAED]">
                    <div className="w-4 h-4 rounded border-2 border-[#DDE0E4]" />
                    <div className="flex-1">
                      <div className="h-2.5 w-3/4 bg-[#E8EAED] rounded mb-1.5" />
                      <div className="h-2 w-1/2 bg-[#F4F5F7] rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-3 w-20 bg-[#E8EAED] rounded mb-4" />
                {[1,2,3].map(i => (
                  <div key={i} className="p-3 rounded-lg border border-[#E8EAED] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-20 bg-[#EEF2FF] rounded" />
                      <div className="h-2.5 w-12 bg-[#EFFAF3] rounded ml-auto" />
                    </div>
                    <div className="h-2 w-full bg-[#F4F5F7] rounded" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#EEF2FF]" />
                      <div className="h-2 w-16 bg-[#F4F5F7] rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-3 w-24 bg-[#E8EAED] rounded mb-4" />
                <div className="p-4 rounded-lg border border-[#E8EAED] space-y-3">
                  <div className="h-2 w-full bg-[#EEF2FF] rounded" />
                  <div className="h-2 w-2/3 bg-[#F4F5F7] rounded" />
                </div>
                <div className="p-4 rounded-lg border border-[#E8EAED]">
                  <div className="h-20 w-20 mx-auto rounded-full border-4 border-[#EEF2FF] border-t-[#6366F1]" style={{ transform: 'rotate(45deg)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg border border-[#E8EAED]">
                    <div className="text-[20px] font-bold text-[#1A1D23]">12</div>
                    <div className="text-[11px] text-[#919BA8]">Tasks</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#E8EAED]">
                    <div className="text-[20px] font-bold text-[#1A1D23]">8</div>
                    <div className="text-[11px] text-[#919BA8]">Done</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-bold text-[#1A1D23] mb-4">Everything you need</h2>
            <p className="text-[16px] text-[#5E6878] max-w-xl mx-auto">
              Powerful features to help your team plan, track, and deliver work — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CheckSquare, title: 'Task Management', desc: 'Create, assign, and track tasks with custom statuses and priorities.' },
              { icon: FolderKanban, title: 'Projects', desc: 'Organize work into projects with timelines, phases, and milestones.' },
              { icon: BarChart3, title: 'Reports', desc: 'Visual dashboards and charts to track progress and performance.' },
              { icon: Users, title: 'Team', desc: 'Manage members, roles, and permissions across your workspace.' },
              { icon: Clock, title: 'Time Tracking', desc: 'Log hours, track billable time, and generate timesheet reports.' },
              { icon: CalendarDays, title: 'Calendar', desc: 'View deadlines and plan sprints with an integrated calendar.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl bg-white border border-[#E8EAED] hover:shadow-lg hover:shadow-[#6366F1]/5 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center mb-4 group-hover:bg-[#6366F1] transition-colors">
                  <feature.icon className="w-5 h-5 text-[#6366F1] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#1A1D23] mb-2">{feature.title}</h3>
                <p className="text-[13px] text-[#5E6878] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[32px] font-bold text-[#1A1D23] mb-4">
            Ready to get started?
          </h2>
          <p className="text-[16px] text-[#5E6878] mb-8 max-w-lg mx-auto">
            Join thousands of teams who use TaskPilot to ship faster and collaborate better.
          </p>
          <Button
            size="lg"
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl px-8 h-12 text-[14px] font-medium gap-2"
            onClick={() => navigate('/signup')}
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8EAED] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#6366F1] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-[13px] font-semibold text-[#1A1D23]">TaskPilot</span>
          </div>
          <p className="text-[12px] text-[#919BA8]">
            Built with care for modern teams.
          </p>
        </div>
      </footer>
    </div>
  )
}
