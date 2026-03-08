const FILTER_CHIPS = ['All', 'Work', 'Personal', 'Health']

export function TodosPlaceholder() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted tabular-nums">0 tasks</span>
        <div className="flex gap-1.5">
          {FILTER_CHIPS.map(chip => (
            <span
              key={chip}
              className="px-3 py-1 rounded-full text-xs text-muted border border-white/5 opacity-40 select-none"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Ghost skeleton rows */}
      <div className="space-y-2">
        <div className="bg-white/[0.03] rounded-xl h-12 animate-pulse opacity-50" />
        <div className="bg-white/[0.03] rounded-xl h-12 animate-pulse opacity-35" />
        <div className="bg-white/[0.03] rounded-xl h-12 animate-pulse opacity-20" />
      </div>

      {/* Dashed add affordance */}
      <div className="border border-dashed border-white/8 rounded-xl px-4 py-3 flex items-center gap-2 text-xs text-muted">
        <span className="text-base leading-none opacity-40">+</span>
        <span>Add task — coming in phase 4</span>
      </div>
    </div>
  )
}
