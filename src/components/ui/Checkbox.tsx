interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && onChange(!checked)}
        className={[
          'w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0',
          checked
            ? 'bg-[#7C5CFC] border border-[#7C5CFC] shadow-[0_0_10px_rgba(124,92,252,0.40)]'
            : 'glass border border-white/10 hover:border-[#7C5CFC]/40',
        ].join(' ')}
      >
        {checked && (
          <svg
            className="checkbox-check w-3 h-3 text-bg"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2,6 5,9 10,3" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm text-text">{label}</span>}
    </label>
  )
}
