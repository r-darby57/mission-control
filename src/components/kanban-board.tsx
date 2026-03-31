'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Clock, User } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedAgent: string
  dueDate: string
  tags: string[]
  status: 'todo' | 'in-progress' | 'review' | 'completed'
}

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'CISSP Domain 6 Deep Dive',
    description: 'Complete Security Assessment and Testing chapter with practice questions',
    priority: 'high',
    assignedAgent: 'Study Coordinator',
    dueDate: '2026-04-01',
    tags: ['cissp', 'certification', 'study'],
    status: 'todo'
  },
  {
    id: 'task-2',
    title: 'Weekly Running Schedule',
    description: 'Plan optimal 19.2-mile weekly distribution with weather considerations',
    priority: 'medium',
    assignedAgent: 'Performance Tracker',
    dueDate: '2026-04-01',
    tags: ['fitness', 'running', 'planning'],
    status: 'in-progress'
  },
  {
    id: 'task-3',
    title: 'NIST Framework Analysis',
    description: 'Research latest cybersecurity framework updates for career advancement',
    priority: 'high',
    assignedAgent: 'Intel Officer',
    dueDate: '2026-04-02',
    tags: ['cybersecurity', 'research', 'career'],
    status: 'in-progress'
  },
  {
    id: 'task-4',
    title: 'HYSA Rate Optimization',
    description: 'Compare current 4.25% rate with competitive options',
    priority: 'low',
    assignedAgent: 'Finance Controller',
    dueDate: '2026-04-03',
    tags: ['finance', 'optimization'],
    status: 'todo'
  },
  {
    id: 'task-5',
    title: 'Morning Briefing System',
    description: 'Automated 5am intelligence compilation and delivery',
    priority: 'critical',
    assignedAgent: 'Strategic Command',
    dueDate: '2026-04-01',
    tags: ['automation', 'briefings'],
    status: 'review'
  }
]

const columns = [
  { id: 'todo', title: 'TO DO', color: 'border-slate-500' },
  { id: 'in-progress', title: 'IN PROGRESS', color: 'border-blue-500' },
  { id: 'review', title: 'REVIEW', color: 'border-yellow-500' },
  { id: 'completed', title: 'COMPLETED', color: 'border-green-500' }
]

function TaskCard({ task, index }: { task: Task; index: number }) {
  const priorityColors = {
    low: 'bg-slate-500/20 text-slate-400',
    medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-yellow-500/20 text-yellow-400',
    critical: 'bg-red-500/20 text-red-400'
  }

  const priorityIcons = {
    low: '⚪',
    medium: '🔵',
    high: '🟡',
    critical: '🔴'
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-slate-800 rounded-xl p-4 mb-3 border border-slate-700
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500/50' : ''}
            hover:border-slate-600 transition-all duration-200
          `}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-white text-sm leading-tight">{task.title}</h3>
            <span className={`px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap ${priorityColors[task.priority]}`}>
              {priorityIcons[task.priority]} {task.priority.toUpperCase()}
            </span>
          </div>
          
          <p className="text-slate-300 text-xs mb-3 leading-relaxed">{task.description}</p>
          
          <div className="grid grid-cols-1 gap-2 mb-3 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-medium">
              <User className="w-3 h-3" />
              <span>{task.assignedAgent}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-[10px] rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </Draggable>
  )
}

function Column({ column, tasks }: { column: typeof columns[0]; tasks: Task[] }) {
  return (
    <div className="flex-1 min-w-[280px] md:min-w-72">
      <div className={`border-t-4 ${column.color} bg-slate-900 rounded-xl p-3 md:p-4`}>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white text-xs md:text-sm">{column.title}</h2>
            <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-48 transition-all duration-200 ${snapshot.isDraggingOver ? 'bg-slate-800/50 rounded-lg' : ''}`}
            >
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileColumn, setMobileColumn] = useState('todo')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const updatedTasks = tasks.map(task => 
      task.id === draggableId 
        ? { ...task, status: destination.droppableId as Task['status'] }
        : task
    )

    setTasks(updatedTasks)
    setMobileColumn(destination.droppableId)
  }

  const getTasksByStatus = (status: string) => tasks.filter(task => task.status === status)
  const currentMobileColumn = columns.find((column) => column.id === mobileColumn) ?? columns[0]

  return (
    <div className="bg-slate-950 rounded-lg p-3 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-blue-400 mb-1 md:mb-2">📋 MISSION CONTROL KANBAN</h1>
          <p className="text-sm md:text-base text-slate-400">Strategic task management for campaign execution</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="text-left sm:text-right text-sm">
            <div className="text-green-400 font-bold">{getTasksByStatus('completed').length}/{tasks.length} Complete</div>
            <div className="text-slate-400">{getTasksByStatus('in-progress').length} In Progress</div>
          </div>
          <button className="px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {isMobile ? (
          <div className="space-y-4">
            <div className="-mx-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 px-1">
                {columns.map((column) => {
                  const isActive = column.id === mobileColumn
                  return (
                    <button
                      key={column.id}
                      onClick={() => setMobileColumn(column.id)}
                      className={`min-w-fit rounded-2xl border px-3.5 py-2.5 text-left transition-all duration-200 ${
                        isActive
                          ? 'border-blue-500/40 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10'
                          : 'border-slate-800 bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className="text-sm font-semibold">{column.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{getTasksByStatus(column.id).length} tasks</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <Column column={currentMobileColumn} tasks={getTasksByStatus(currentMobileColumn.id)} />
          </div>
        ) : (
          <div className="flex gap-3 md:gap-6 overflow-x-auto pb-4 md:pb-6 scrollbar-hide">
            {columns.map(column => (
              <Column key={column.id} column={column} tasks={getTasksByStatus(column.id)} />
            ))}
          </div>
        )}
      </DragDropContext>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{getTasksByStatus('todo').filter(t => t.priority === 'critical').length}</div>
            <div className="text-xs text-slate-400">Critical Tasks</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{getTasksByStatus('in-progress').length}</div>
            <div className="text-xs text-slate-400">Active Work</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{getTasksByStatus('review').length}</div>
            <div className="text-xs text-slate-400">Pending Review</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{Math.round((getTasksByStatus('completed').length / tasks.length) * 100)}%</div>
            <div className="text-xs text-slate-400">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
