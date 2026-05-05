/**
 * TaskPilot Design System — Light Blue Primary
 */

export const colors = {
  primary: {
    DEFAULT: '#3B82F6',
    hover: '#2563EB',
    light: '#EFF6FF',
    dark: '#1D4ED8',
  },
  sidebar: {
    bg: '#FAFBFC',
    hover: '#F0F1F3',
    active: '#EFF6FF',
    border: '#ECEEF1',
  },
  status: {
    todo: { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB', dot: '#9CA3AF' },
    inProgress: { bg: '#EFF6FF', text: '#1D4ED8', border: '#93C5FD', dot: '#3B82F6' },
    done: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC', dot: '#22C55E' },
    open: { bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5', dot: '#EF4444' },
    closed: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC', dot: '#22C55E' },
  },
  priority: {
    urgent: { bg: '#FEF2F2', text: '#DC2626', icon: '#EF4444' },
    high: { bg: '#FFF7ED', text: '#EA580C', icon: '#F97316' },
    medium: { bg: '#FEFCE8', text: '#CA8A04', icon: '#EAB308' },
    low: { bg: '#F3F4F6', text: '#6B7280', icon: '#9CA3AF' },
  },
  severity: {
    critical: { bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' },
    high: { bg: '#FFF7ED', text: '#C2410C', border: '#FDBA74' },
    medium: { bg: '#FEFCE8', text: '#A16207', border: '#FDE68A' },
    low: { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' },
  },
  surface: {
    page: '#F7F8FA',
    card: '#FFFFFF',
    hover: '#F4F5F7',
    elevated: '#FFFFFF',
  },
  text: {
    primary: '#1D2129',
    secondary: '#5E6878',
    muted: '#919BA8',
    inverse: '#FFFFFF',
  },
  border: {
    DEFAULT: '#E8EAED',
    light: '#F4F5F7',
    focus: '#3B82F6',
  },
}

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  DEFAULT: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '2.5rem',
}

export const radius = {
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
}

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.8125rem', { lineHeight: '1.25rem' }],
    base: ['0.875rem', { lineHeight: '1.5rem' }],
    lg: ['1rem', { lineHeight: '1.75rem' }],
    xl: ['1.125rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.25rem', { lineHeight: '2rem' }],
    '3xl': ['1.5rem', { lineHeight: '2.25rem' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
}

export const widgetVariants = {
  default: 'bg-white border border-[#E8EAED] rounded-lg shadow-sm',
  flat: 'bg-white border border-[#F4F5F7] rounded-lg',
  elevated: 'bg-white border border-[#E8EAED] rounded-lg shadow-md',
  ghost: 'bg-transparent',
}

export const statusBadgeVariants = {
  todo: 'bg-[#F3F4F6] text-[#6B7280]',
  inProgress: 'bg-[#EFF6FF] text-[#1D4ED8]',
  done: 'bg-[#DCFCE7] text-[#166534]',
  open: 'bg-[#FEF2F2] text-[#991B1B]',
  closed: 'bg-[#DCFCE7] text-[#166534]',
  resolved: 'bg-[#DCFCE7] text-[#166534]',
  active: 'bg-[#EFF6FF] text-[#1D4ED8]',
  completed: 'bg-[#DCFCE7] text-[#166534]',
  'on hold': 'bg-[#FEFCE8] text-[#A16207]',
  'not started': 'bg-[#F3F4F6] text-[#6B7280]',
}

export const priorityBadgeVariants = {
  urgent: 'bg-[#FEF2F2] text-[#DC2626]',
  high: 'bg-[#FFF7ED] text-[#EA580C]',
  medium: 'bg-[#FEFCE8] text-[#CA8A04]',
  low: 'bg-[#F3F4F6] text-[#6B7280]',
}

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
}

export const transitions = {
  fast: '150ms ease-in-out',
  DEFAULT: '200ms ease-in-out',
  slow: '300ms ease-in-out',
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}