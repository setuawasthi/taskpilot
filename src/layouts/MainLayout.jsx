import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useData } from '@/context/DataContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import CommandPalette from '@/components/CommandPalette'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  AlertCircle,
  Layers,
  Clock,
  BarChart3,
  CalendarDays,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  Plus,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Sparkles,
  Command,
} from 'lucide-react'

const navSections = [
  {
    label: null,
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/my-work', label: 'My Work', icon: CheckSquare },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { path: '/projects', label: 'Projects', icon: FolderKanban },
      { path: '/tasks', label: 'Tasks', icon: CheckSquare },
      { path: '/issues', label: 'Issues', icon: AlertCircle },
      { path: '/phases', label: 'Phases', icon: Layers },
    ],
  },
  {
    label: 'Insights',
    items: [
      { path: '/timelogs', label: 'Time Logs', icon: Clock },
      { path: '/reports', label: 'Reports', icon: BarChart3 },
      { path: '/calendar', label: 'Calendar', icon: CalendarDays },
    ],
  },
  {
    label: 'Admin',
    items: [
      { path: '/team', label: 'Team', icon: Users },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function MainLayout() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, searchAll } = useData()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setSearchResults(searchAll(searchQuery))
    } else {
      setSearchResults([])
    }
  }, [searchQuery, searchAll])

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkMode])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleResultClick = (link) => {
    navigate(link)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const SidebarContent = ({ onItemClick }) => (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-14 shrink-0 border-b border-[var(--color-mo-border-layout)]">
        <div className="w-7 h-7 rounded-lg bg-[var(--color-mo-brand)] flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-[14px] font-semibold text-[var(--color-mo-text-primary)] tracking-tight">TaskPilot</span>
        <Button variant="ghost" size="sm" className="ml-auto lg:hidden text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-text-secondary)] hover:bg-[var(--color-mo-bg-ui)]" onClick={() => setSidebarOpen(false)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <div className="px-3 pt-3 pb-2">
        <Button
          className="w-full justify-start gap-2 rounded-lg bg-[var(--color-mo-brand)] hover:bg-[var(--color-mo-brand-hover)] text-white h-8 text-[13px] font-medium shadow-none"
          onClick={() => { navigate('/tasks'); onItemClick?.() }}
        >
          <Plus className="w-3.5 h-3.5" />
          New Task
        </Button>
      </div>

      <nav className="flex-1 px-2 pb-4 overflow-y-auto">
        {navSections.map((section, si) => (
          <div key={si} className={cn(si > 0 && 'mt-4')}>
            {section.label && (
              <div className="px-3 mb-1.5">
                <span className="text-[10px] font-semibold text-[var(--color-mo-text-muted)] uppercase tracking-wider">{section.label}</span>
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onItemClick?.()}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-[6px] rounded-md text-[13px] font-medium transition-all duration-150',
                    isActive
                      ? 'bg-[var(--color-mo-brand-surface)] text-[var(--color-mo-brand)]'
                      : 'text-[var(--color-mo-text-secondary)] hover:bg-[var(--color-mo-bg-ui)] hover:text-[var(--color-mo-text-primary)]'
                  )}
                >
                  <Icon className={cn('w-[16px] h-[16px]', isActive ? 'text-[var(--color-mo-brand)]' : 'text-[var(--color-mo-text-muted)]')} />
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--color-mo-border-layout)] p-3">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="text-[11px] bg-[var(--color-mo-brand)] text-white font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--color-mo-text-primary)] truncate">{currentUser.name}</p>
            <p className="text-[11px] text-[var(--color-mo-text-muted)] truncate">{currentUser.email}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen w-full bg-[var(--color-mo-bg-ui)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-[var(--color-mo-border-layout)] bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[260px] p-0 border-r border-[var(--color-mo-border-layout)] bg-white">
          <SidebarContent onItemClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-12 bg-white border-b border-[var(--color-mo-border-layout)] flex items-center px-4 gap-3 shrink-0">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 -ml-1 text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-text-secondary)]" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center text-[12px] text-[var(--color-mo-text-muted)]">
            <span className="font-medium text-[var(--color-mo-text-secondary)]">TaskPilot</span>
            {location.pathname !== '/dashboard' && (
              <>
                <ChevronRight className="w-3 h-3 mx-1" />
                <span className="capitalize">{location.pathname.split('/')[1].replace('-', ' ')}</span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <button
            className="relative flex items-center gap-2 pl-8 pr-3 h-8 bg-[var(--color-mo-bg-ui)] border border-[var(--color-mo-border-layout)] rounded-lg text-[13px] text-left transition-all hover:bg-white hover:border-[var(--color-mo-border-input)] cursor-pointer min-w-[200px] max-w-sm"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-mo-text-muted)]" />
            <span className="text-[var(--color-mo-text-placeholder)]">Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium text-[var(--color-mo-text-muted)] bg-white border border-[var(--color-mo-border-layout)] ml-auto">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm"
              className="p-1.5 text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-text-secondary)] hover:bg-[var(--color-mo-bg-ui)] rounded-md transition-colors"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="w-[15px] h-[15px]" /> : <Moon className="w-[15px] h-[15px]" />}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative p-1.5 text-[var(--color-mo-text-muted)] hover:text-[var(--color-mo-text-secondary)] hover:bg-[var(--color-mo-bg-ui)] rounded-md transition-colors">
                  <Bell className="w-[15px] h-[15px]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[var(--color-mo-error-primary)] rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="flex items-center justify-between text-[13px]">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button variant="link" size="sm" className="text-[11px] text-[var(--color-mo-brand)] h-auto p-0" onClick={markAllNotificationsRead}>
                      Mark all read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="px-3 py-4 text-[13px] text-[var(--color-mo-text-muted)] text-center">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className={cn('flex flex-col items-start gap-0.5 cursor-pointer text-[13px]', !n.read && 'bg-[var(--color-mo-brand-surface)]/50')}
                      onClick={() => { markNotificationRead(n.id); if (n.link) navigate(n.link) }}
                    >
                      <span className="font-medium">{n.message}</span>
                      <span className="text-[11px] text-[var(--color-mo-text-muted)]">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1.5 p-1 rounded-md hover:bg-[var(--color-mo-bg-ui)] transition-colors ml-0.5">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[10px] bg-[var(--color-mo-brand)] text-white font-medium">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-[13px]">{currentUser.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[13px]" onClick={() => navigate('/settings')}>
                  <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-[13px]" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun className="w-3.5 h-3.5 mr-2" /> : <Moon className="w-3.5 h-3.5 mr-2" />}
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[13px] text-[var(--color-mo-error-primary)]" onClick={() => navigate('/')}>
                  <LogOut className="w-3.5 h-3.5 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  )
}
