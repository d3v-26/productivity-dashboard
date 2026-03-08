import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — bottom sheet on mobile, centered on desktop */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
        <div
          className={[
            'pointer-events-auto w-full md:max-w-md p-6',
            'glass-bright rounded-t-3xl md:rounded-2xl animate-slide-up',
            'border-t border-white/10 md:border',
          ].join(' ')}
          onClick={e => e.stopPropagation()}
        >
          {/* Teal top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-sage/60 to-transparent rounded-full md:hidden" />

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-text tracking-wide">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1.5 -mr-1">
              <X size={15} />
            </Button>
          </div>

          {children}
        </div>
      </div>
    </>,
    document.body
  )
}
