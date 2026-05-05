import { useNavigate } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function CalendarPage() {
  const navigate = useNavigate()
  const { tasks, issues } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear()

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const dayEvents = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const t = tasks.filter(task => task.dueDate === dateStr)
    const i = issues.filter(issue => issue.dueDate === dateStr)
    return [...t.map(x => ({ ...x, type: 'task' })), ...i.map(x => ({ ...x, type: 'issue' }))]
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => setCurrentDate(new Date())

  const handleEventClick = (event) => {
    if (event.type === 'task') {
      navigate(`/tasks/${event.id}`)
    } else {
      navigate('/issues')
    }
  }

  return (
    <div className="px-5 lg:px-8 py-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[17px] font-semibold text-[#1D2129]">Calendar</h1>
          <p className="text-[13px] text-[#919BA8] mt-0.5">View tasks and issues by due date.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[12px] rounded-md border-[#E8EAED] text-[#5E6878] hover:bg-[#F4F5F7]" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-md border-[#E8EAED] text-[#5E6878] hover:bg-[#F4F5F7]" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-[13px] font-semibold text-[#1D2129] min-w-[130px] text-center">{monthName}</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-md border-[#E8EAED] text-[#5E6878] hover:bg-[#F4F5F7]" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[#E8EAED] rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b border-[#E8EAED]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="px-3 py-2 text-[11px] font-semibold text-[#919BA8] uppercase tracking-wider text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-2 border-b border-r border-[#F4F5F7] bg-[#FAFBFC]" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const events = dayEvents(day)
            const isToday = isCurrentMonth && day === today.getDate()
            return (
              <div key={day} className={cn(
                'min-h-[100px] p-2 border-b border-r border-[#F4F5F7] transition-colors',
                isToday && 'bg-[#EEF0FE]/30'
              )}>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    'text-[13px] font-medium w-6 h-6 flex items-center justify-center rounded-full',
                    isToday ? 'bg-[#6366F1] text-white' : 'text-[#1D2129]'
                  )}>{day}</span>
                </div>
                <div className="space-y-px">
                  {events.slice(0, 3).map((event, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'text-[11px] px-1.5 py-px rounded font-medium truncate leading-snug cursor-pointer hover:opacity-80 transition-opacity',
                        event.type === 'task'
                          ? 'bg-[#EEF0FE] text-[#3D4CB8]'
                          : 'bg-[#FEE2E2] text-[#991B1B]'
                      )}
                      onClick={() => handleEventClick(event)}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-[10px] text-[#919BA8] pl-1.5 font-medium">+{events.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}