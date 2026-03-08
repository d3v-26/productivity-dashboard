import { Settings } from 'lucide-react'

interface MobileHeaderProps {
  onSettingsClick: () => void
}

export default function MobileHeader({ onSettingsClick }: MobileHeaderProps) {
  return (
    <header
      className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-white/[0.05]"
      style={{ background: 'var(--color-bg)' }}
    >
      <span className="font-mono text-sm font-medium text-[#7C5CFC] tracking-widest">pl</span>
      <button
        onClick={onSettingsClick}
        aria-label="Open settings"
        className="text-muted hover:text-text transition-colors"
      >
        <Settings size={18} />
      </button>
    </header>
  )
}
