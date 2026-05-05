import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import {
  Command,
  Search,
  FolderKanban,
  CheckSquare,
  AlertCircle,
  ArrowRight,
  Clock,
  CalendarDays,
  Users,
  Settings,
  LayoutDashboard,
  Layers,
  BarChart3,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Work', path: '/my-work', icon: CheckSquare },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare },
  { label: 'Issues', path: '/issues', icon: AlertCircle },
  { label: 'Phases', path: '/phases', icon: Layers },
  { label: 'Time Logs', path: '/timelogs', icon: Clock },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Calendar', path: '/calendar', icon: CalendarDays },
  { label: 'Team', path: '/team', icon: Users },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export default function CommandPalette({ open, onOpenChange }) {
  const { projects, tasks, issues, searchAll } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const searchResults = query.trim().length > 0 ? searchAll(query) : []
  const filteredNav = query.trim().length > 0
    ? navItems.filter(n => n.label.toLowerCase().includes(query.toLowerCase()))
    : navItems

  const allResults = [
    ...filteredNav.map(n => ({ ...n, type: 'nav' })),
    ...searchResults.map(r => ({ ...r, type: 'search' })),
  ]

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleSelect = useCallback((item) => {
    if (item.type === 'nav') {
      navigate(item.path)
    } else {
      navigate(item.link)
    }
    onOpenChange(false)
    setQuery('')
  }, [navigate, onOpenChange])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % allResults.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + allResults.length) % allResults.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (allResults[selectedIndex]) {
          handleSelect(allResults[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        onOpenChange(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, allResults, selectedIndex, handleSelect, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-start justify-center pt-[15vh]" onClick={() => { onOpenChange(false); setQuery('') }}>
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E8EAED] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8EAED]">
          <Search className="w-4 h-4 text-[#919BA8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tasks, projects, issues, or navigate..."
            className="flex-1 text-[14px] text-[#1D2129] placeholder:text-[#B8BFC7] bg-transparent outline-none"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-[#919BA8] bg-[#F4F5F7] border border-[#E8EAED]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-1">
          {allResults.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search className="w-8 h-8 text-[#DDE0E4] mx-auto mb-2" />
              <p className="text-[13px] text-[#919BA8]">No results found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <>
              {filteredNav.length > 0 && (
                <div className="px-3 py-1.5">
                  <p className="text-[10px] font-semibold text-[#919BA8] uppercase tracking-wider px-2">Navigation</p>
                  {filteredNav.map((item, idx) => {
                    const globalIdx = idx
                    const Icon = item.icon
                    return (
                      <button
                        key={`nav-${item.path}`}
                        className={cn(
                          'flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-left text-[13px] transition-colors',
                          globalIdx === selectedIndex ? 'bg-[#EEF2FF] text-[#6366F1]' : 'text-[#5E6878] hover:bg-[#F7F8FA]'
                        )}
                        onClick={() => handleSelect({ ...item, type: 'nav' })}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                      >
                        <Icon className={cn('w-4 h-4', globalIdx === selectedIndex ? 'text-[#6366F1]' : 'text-[#919BA8]')} />
                        <span className="flex-1">{item.label}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                      </button>
                    )
                  })}
                </div>
              )}

              {searchResults.length > 0 && filteredNav.length > 0 && (
                <div className="border-t border-[#F4F5F7] my-1" />
              )}

              {searchResults.length > 0 && (
                <div className="px-3 py-1.5">
                  <p className="text-[10px] font-semibold text-[#919BA8] uppercase tracking-wider px-2">Search Results</p>
                  {searchResults.map((item, idx) => {
                    const globalIdx = filteredNav.length + idx
                    const typeIcon = item.type === 'Project' ? FolderKanban :
                      item.type === 'Task' ? CheckSquare :
                      item.type === 'Issue' ? AlertCircle : Search
                    const Icon = typeIcon
                    return (
                      <button
                        key={`search-${item.type}-${item.id}`}
                        className={cn(
                          'flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-left text-[13px] transition-colors',
                          globalIdx === selectedIndex ? 'bg-[#EEF2FF] text-[#6366F1]' : 'text-[#5E6878] hover:bg-[#F7F8FA]'
                        )}
                        onClick={() => handleSelect({ ...item, type: 'search' })}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                      >
                        <div className={cn('w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-semibold shrink-0',
                          globalIdx === selectedIndex ? 'bg-[#6366F1] text-white' : 'bg-[#EEF2FF] text-[#6366F1]'
                        )}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{item.name}</p>
                          <p className="text-[11px] text-[#919BA8]">{item.type}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-[#B8BFC7]" />
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#E8EAED] flex items-center gap-3 text-[11px] text-[#919BA8]">
          <div className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded text-[10px] bg-[#F4F5F7] border border-[#E8EAED]">↑</kbd>
            <kbd className="px-1 py-0.5 rounded text-[10px] bg-[#F4F5F7] border border-[#E8EAED]">↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded text-[10px] bg-[#F4F5F7] border border-[#E8EAED]">↵</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <kbd className="px-1 py-0.5 rounded text-[10px] bg-[#F4F5F7] border border-[#E8EAED]">esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
