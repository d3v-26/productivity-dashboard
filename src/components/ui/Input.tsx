import { useState } from 'react'

interface InputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  className?: string
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  className = '',
}: InputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-muted uppercase tracking-widest mb-1.5">
          {label}
          {required && <span className="text-[#F87171] ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={[
          'w-full glass rounded-xl px-3.5 py-2.5 text-sm text-text',
          'placeholder:text-muted outline-none transition-all duration-200',
          focused
            ? 'border-[#7C5CFC]/50 shadow-[0_0_0_3px_rgba(124,92,252,0.08)]'
            : 'hover:border-white/15',
        ].join(' ')}
      />
    </div>
  )
}
