import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

const variantClasses = {
  primary: [
    'bg-[#7C5CFC] text-white',
    'hover:bg-[#6347E0] shadow-[0_2px_14px_rgba(124,92,252,0.35)]',
    'transition-all active:scale-95',
  ].join(' '),

  secondary: [
    'bg-white/[0.07] text-text border border-white/[0.09]',
    'hover:bg-white/[0.12] hover:border-white/[0.16]',
    'transition-all',
  ].join(' '),

  ghost: [
    'text-muted hover:text-text',
    'hover:bg-white/5',
    'transition-all duration-150',
  ].join(' '),
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs tracking-wide',
  md: 'px-4 py-2 text-sm tracking-wide',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'rounded-xl font-medium inline-flex items-center justify-center gap-1.5',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
