import { useState } from 'react'
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react'
import type { FilterState, FilterPriority, FilterStatus, SortBy } from '../../hooks/useTodos'

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all',       label: 'All'    },
  { value: 'active',    label: 'Active' },
  { value: 'completed', label: 'Done'   },
]

const PRIORITY_OPTIONS: { value: FilterPriority; label: string }[] = [
  { value: 'all',    label: 'Any'    },
  { value: 'high',   label: 'High'   },
  { value: 'medium', label: 'Med'    },
  { value: 'low',    label: 'Low'    },
]

const PRIORITY_LABELS: Record<string, string> = {
  high: 'High', medium: 'Med', low: 'Low',
}

const CATEGORY_OPTIONS = ['all', 'Personal', 'Work', 'Health', 'Learning', 'Other'] as const

const SORT_CYCLE: SortBy[] = ['created', 'dueDate', 'priority']
const SORT_LABELS: Record<SortBy, string> = {
  created:  'Newest',
  dueDate:  'Due date',
  priority: 'Priority',
}

interface TodoFiltersProps {
  filterState:  FilterState
  sortBy:       SortBy
  onChange:     (patch: Partial<FilterState>) => void
  onSortChange: (sort: SortBy) => void
}

export function TodoFilters({ filterState, sortBy, onChange, onSortChange }: TodoFiltersProps) {
  const [filterOpen, setFilterOpen] = useState(false)

  const activeFilterCount =
    (filterState.priority !== 'all' ? 1 : 0) +
    (filterState.category  !== 'all' ? 1 : 0)

  function cycleSort() {
    const idx = SORT_CYCLE.indexOf(sortBy)
    onSortChange(SORT_CYCLE[(idx + 1) % SORT_CYCLE.length])
  }

  const pillCls = (active: boolean) =>
    'px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 ' +
    (active
      ? 'bg-[#7C5CFC]/15 text-[#7C5CFC] border border-[#7C5CFC]/30'
      : 'text-muted border border-white/5 hover:border-white/15 hover:text-text')

  return (
    <div className="flex flex-col gap-2">
      {/* Row 1 */}
      <div className="flex items-center gap-2">
        {/* Status pills */}
        <div className="flex items-center gap-1">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ status: value })}
              className={pillCls(filterState.status === value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Filters toggle */}
        <button
          onClick={() => setFilterOpen(o => !o)}
          className={[
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 border',
            filterOpen || activeFilterCount > 0
              ? 'bg-[#7C5CFC]/10 text-[#7C5CFC] border-[#7C5CFC]/20'
              : 'text-muted border-white/10 hover:border-white/20 hover:text-text',
          ].join(' ')}
        >
          <SlidersHorizontal size={12} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#7C5CFC]/30 text-[#7C5CFC] text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort cycling — pushed right */}
        <button
          onClick={cycleSort}
          className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted hover:text-text transition-colors duration-150"
        >
          <ArrowUpDown size={12} />
          {SORT_LABELS[sortBy]}
        </button>
      </div>

      {/* Row 2a — filter panel */}
      {filterOpen && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted w-14 shrink-0">Priority</span>
            {PRIORITY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ priority: value })}
                className={pillCls(filterState.priority === value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted w-14 shrink-0">Category</span>
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat}
                onClick={() => onChange({ category: cat })}
                className={pillCls(filterState.category === cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Row 2b — active chips */}
      {!filterOpen && activeFilterCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterState.priority !== 'all' && (
            <button
              onClick={() => onChange({ priority: 'all' })}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#7C5CFC]/15 text-[#7C5CFC] border border-[#7C5CFC]/30 transition-colors hover:bg-[#7C5CFC]/25"
            >
              {PRIORITY_LABELS[filterState.priority]}
              <X size={10} />
            </button>
          )}
          {filterState.category !== 'all' && (
            <button
              onClick={() => onChange({ category: 'all' })}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#7C5CFC]/15 text-[#7C5CFC] border border-[#7C5CFC]/30 transition-colors hover:bg-[#7C5CFC]/25"
            >
              {filterState.category}
              <X size={10} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
