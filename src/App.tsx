import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { useTodos } from './hooks/useTodos'
import { useCalendar } from './hooks/useCalendar'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import MobileHeader from './components/layout/MobileHeader'
import BottomNav from './components/layout/BottomNav'
import { HabitList } from './components/habits/HabitList'
import { TodoList } from './components/todos/TodoList'
import DetailPanel, { type SelectedItem } from './components/layout/DetailPanel'
import { CalendarGrid } from './components/calendar/CalendarGrid'
import { Modal } from './components/ui/Modal'
import { Button } from './components/ui/Button'
import { exportAllData, clearAllData } from './lib/storage'
import { parseICS } from './lib/icsParser'
import type { Todo, Habit } from './types'

export default function App() {
  // Habits
  const { habits, todayCompletions, streaks, addHabit, deleteHabit, toggleHabit } = useHabits()
  const [showHabitForm, setShowHabitForm] = useState(false)

  // Todos (lifted)
  const {
    todos,
    filteredTodos,
    filterState,
    setFilterState,
    sortBy,
    setSortBy,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos()
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  // Calendar (lifted so Sidebar can read reactive events)
  const calendar = useCalendar()

  // UI
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [importedCount, setImportedCount] = useState<number | null>(null)

  // Derived
  const completedHabits = habits.filter(h => todayCompletions.has(h.id)).length
  const activeTasks = todos.filter(t => !t.completed).length

  function handleSelectTodo(todo: Todo) {
    setSelectedItem(prev =>
      prev?.type === 'todo' && prev.item.id === todo.id ? null : { type: 'todo', item: todo }
    )
  }

  function handleSelectHabit(habit: Habit) {
    setSelectedItem(prev =>
      prev?.type === 'habit' && prev.habit.id === habit.id
        ? null
        : { type: 'habit', habit, streak: streaks[habit.id] ?? 0, isCompleted: todayCompletions.has(habit.id) }
    )
  }

  function handleCloseDetail() {
    setSelectedItem(null)
  }

  function handleEditTodo(todo: Todo) {
    setEditingTodo(todo)
    setShowTodoForm(true)
    setSelectedItem(null)
  }

  function handleDeleteTodo(id: string) {
    deleteTodo(id)
    setSelectedItem(null)
  }

  function handleToggleTodo(id: string) {
    toggleTodo(id)
    // Update selected item if it's this todo
    setSelectedItem(prev => {
      if (prev?.type === 'todo' && prev.item.id === id) {
        const updated = todos.find(t => t.id === id)
        if (updated) return { type: 'todo', item: { ...updated, completed: !updated.completed } }
      }
      return prev
    })
  }

  function handleDeleteHabit(id: string) {
    deleteHabit(id)
    setSelectedItem(null)
  }

  function handleToggleHabit(id: string) {
    toggleHabit(id)
    setSelectedItem(prev => {
      if (prev?.type === 'habit' && prev.habit.id === id) {
        return {
          ...prev,
          isCompleted: !prev.isCompleted,
          streak: prev.isCompleted ? Math.max(0, prev.streak - 1) : prev.streak + 1,
        }
      }
      return prev
    })
  }

  function handleExportData() {
    const json = exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pl-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleICSImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = parseICS(text)
      calendar.importEvents(parsed)
      setImportedCount(parsed.length)
    }
    reader.readAsText(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  function handleClearImported() {
    calendar.clearImportedEvents()
    setImportedCount(null)
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 3000)
    } else {
      clearAllData()
      window.location.reload()
    }
  }

  const selectedTodoId = selectedItem?.type === 'todo' ? selectedItem.item.id : null
  const selectedHabitId = selectedItem?.type === 'habit' ? selectedItem.habit.id : null

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        events={calendar.allEvents}
      />

      <div
        className="flex flex-col flex-1 min-h-screen transition-[padding] duration-200 ease-in-out"
        style={{ paddingLeft: sidebarCollapsed ? '60px' : '220px' }}
      >
        <MobileHeader onSettingsClick={() => setShowSettings(true)} />

        <TopBar
          completedHabits={completedHabits}
          totalHabits={habits.length}
          activeTasks={activeTasks}
          totalTasks={todos.length}
          onSettingsClick={() => setShowSettings(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Main content: Tasks + Habits side by side */}
          <div className="flex-1 overflow-y-auto p-6 flex gap-5 pb-16 md:pb-0">
            <div id="todos" className="flex-[3] min-w-0">
              <TodoList
                filteredTodos={filteredTodos}
                filterState={filterState}
                sortBy={sortBy}
                onFilterChange={patch => setFilterState(prev => ({ ...prev, ...patch }))}
                onSortChange={setSortBy}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onAdd={addTodo}
                onUpdate={updateTodo}
                onSelect={handleSelectTodo}
                selectedId={selectedTodoId}
                showForm={showTodoForm}
                editingTodo={editingTodo}
                onShowForm={(todo) => { setEditingTodo(todo ?? null); setShowTodoForm(true) }}
                onCloseForm={() => { setShowTodoForm(false); setEditingTodo(null) }}
              />
            </div>
            <div id="habits" className="flex-[2] min-w-0">
              <HabitList
                habits={habits}
                todayCompletions={todayCompletions}
                streaks={streaks}
                onAdd={addHabit}
                onDelete={deleteHabit}
                onToggle={toggleHabit}
                showForm={showHabitForm}
                onShowForm={() => setShowHabitForm(true)}
                onCloseForm={() => setShowHabitForm(false)}
                onSelectHabit={handleSelectHabit}
                selectedHabitId={selectedHabitId}
              />
            </div>
          </div>

          {/* Right panel */}
          <div id="calendar" className="w-[288px] border-l border-white/[0.05] flex flex-col overflow-y-auto p-5 shrink-0">
            {selectedItem && (
              <DetailPanel
                selected={selectedItem}
                onClose={handleCloseDetail}
                onEditTodo={handleEditTodo}
                onDeleteTodo={handleDeleteTodo}
                onToggleTodo={handleToggleTodo}
                onToggleHabit={handleToggleHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            )}
            <CalendarGrid
              currentMonth={calendar.currentMonth}
              selectedDate={calendar.selectedDate}
              calendarDays={calendar.calendarDays}
              selectedDateEvents={calendar.selectedDateEvents}
              prevMonth={calendar.prevMonth}
              nextMonth={calendar.nextMonth}
              goToToday={calendar.goToToday}
              selectDate={calendar.selectDate}
              addEvent={calendar.addEvent}
              updateEvent={calendar.updateEvent}
              deleteEvent={calendar.deleteEvent}
            />
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => { setShowSettings(false); setConfirmReset(false) }}
        title="Settings"
      >
        <div className="space-y-6">
          {/* Calendar import section */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-3">Calendar</p>
            <div className="space-y-2">
              <label className="block">
                <span className="sr-only">Import calendar (.ics)</span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => document.getElementById('ics-file-input')?.click()}
                >
                  Import calendar (.ics)
                </Button>
                <input
                  id="ics-file-input"
                  type="file"
                  accept=".ics"
                  className="hidden"
                  onChange={handleICSImport}
                />
              </label>
              {importedCount !== null && (
                <p className="text-xs text-muted">
                  {importedCount} event{importedCount !== 1 ? 's' : ''} imported
                </p>
              )}
              {calendar.importedEvents.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted"
                  onClick={handleClearImported}
                >
                  Clear imported events ({calendar.importedEvents.length})
                </Button>
              )}
            </div>
          </div>

          {/* Data section */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-3">Data</p>
            <div className="space-y-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                onClick={handleExportData}
              >
                Export data
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={[
                  'w-full justify-start',
                  confirmReset
                    ? 'text-[#F87171] bg-[#F87171]/10 hover:bg-[#F87171]/10'
                    : 'text-[#F87171] hover:bg-[#F87171]/10',
                ].join(' ')}
                onClick={handleReset}
              >
                {confirmReset ? 'Are you sure? Click again to confirm' : 'Reset all data'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
