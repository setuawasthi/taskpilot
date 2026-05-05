import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardWidget({
  title,
  icon: Icon,
  action,
  children,
  className,
  variant = 'default',
  headerClassName,
  contentClassName,
}) {
  const variants = {
    default: 'bg-white border border-gray-200 rounded-xl shadow-sm',
    flat: 'bg-white border border-gray-100 rounded-xl',
    elevated: 'bg-white border border-gray-200 rounded-xl shadow-md',
    ghost: 'bg-transparent',
  }

  return (
    <Card className={cn(variants[variant], className)}>
      {(title || action) && (
        <CardHeader className={cn('pb-2 flex flex-row items-center justify-between', headerClassName)}>
          <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            {title}
          </CardTitle>
          {action}
        </CardHeader>
      )}
      <CardContent className={cn('pt-0', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}

export function MetricCard({ label, value, icon: Icon, color = 'blue', onClick }) {
  const colorMap = {
    blue: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'text-indigo-500' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', icon: 'text-cyan-500' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <Card
      className={cn(
        'shadow-sm border-0 bg-white cursor-pointer hover:shadow-md transition-all duration-200',
        onClick && 'active:scale-[0.98]'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
            <p className={cn('text-2xl font-bold', c.text)}>{value}</p>
          </div>
          {Icon && (
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', c.bg)}>
              <Icon className={cn('w-4 h-4', c.icon)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function TaskStatusBadge({ status }) {
  const variants = {
    'To Do': 'bg-gray-100 text-gray-600',
    'In Progress': 'bg-indigo-100 text-indigo-700',
    'Done': 'bg-emerald-100 text-emerald-700',
    'Open': 'bg-red-100 text-red-700',
    'Closed': 'bg-emerald-100 text-emerald-700',
    'Resolved': 'bg-emerald-100 text-emerald-700',
    'Active': 'bg-indigo-100 text-indigo-700',
    'Completed': 'bg-emerald-100 text-emerald-700',
    'On Hold': 'bg-amber-100 text-amber-700',
    'Not Started': 'bg-gray-100 text-gray-600',
  }

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold', variants[status] || variants['To Do'])}>
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const variants = {
    'Urgent': 'text-red-500',
    'High': 'text-orange-500',
    'Medium': 'text-amber-500',
    'Low': 'text-gray-400',
  }

  return (
    <span className={cn('inline-flex items-center text-xs font-medium', variants[priority] || variants['Low'])}>
      <svg className="w-3.5 h-3.5 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 15h13.865a1 1 0 00.768-1.64L15 9l3.633-4.36A1 1 0 0017.865 3H4v18h2v-6z" />
      </svg>
      {priority}
    </span>
  )
}

export function StatusDot({ status }) {
  const colors = {
    'To Do': 'bg-gray-400',
    'In Progress': 'bg-indigo-500',
    'Done': 'bg-emerald-500',
    'Open': 'bg-red-500',
    'Closed': 'bg-emerald-500',
    'Resolved': 'bg-emerald-500',
  }

  return (
    <span className={cn('w-2 h-2 rounded-full inline-block', colors[status] || colors['To Do'])} />
  )
}

export function EmptyState({ icon: Icon, title, description, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-10 text-center', className)}>
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
          <Icon className="w-7 h-7 text-gray-300" />
        </div>
      )}
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  )
}

export function SectionHeader({ title, count, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {count !== undefined && (
          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{count}</span>
        )}
      </div>
      {action}
    </div>
  )
}
