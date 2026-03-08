import type { ReactNode } from 'react'

interface BadgeProps {
  variant: 'low' | 'medium' | 'high' | 'category'
  children: ReactNode
}

const variantClasses = {
  low:      'bg-[#7C5CFC]/10 text-[#7C5CFC] border border-[#7C5CFC]/20',
  medium:   'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
  high:     'bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/20',
  category: 'bg-white/5 text-muted border border-white/10',
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={[
      'inline-flex items-center text-xs font-mono font-medium px-2 py-0.5 rounded-md tracking-wide',
      variantClasses[variant],
    ].join(' ')}>
      {children}
    </span>
  )
}
