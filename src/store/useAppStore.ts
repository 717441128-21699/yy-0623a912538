import { create } from 'zustand'
import { TaskItem, PrepStep, HandoverItem, SwapRequest } from '@/types'
import { mockTasks } from '@/data/tasks'
import { mockPrepSteps } from '@/data/preparations'
import { mockHandovers } from '@/data/handovers'
import { mockSwaps } from '@/data/swaps'

interface AppState {
  tasks: TaskItem[]
  prepSteps: PrepStep[]
  handovers: HandoverItem[]
  swaps: SwapRequest[]
  myPoints: number
  updateTaskStatus: (id: string, status: TaskItem['status']) => void
  togglePrepStep: (id: string) => void
  toggleHandoverStep: (handoverId: string, stepId: string) => void
  takeSwap: (id: string, takerName: string) => void
  addPoints: (points: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  tasks: mockTasks,
  prepSteps: mockPrepSteps,
  handovers: mockHandovers,
  swaps: mockSwaps,
  myPoints: 2450,

  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t))
    })),

  togglePrepStep: (id) =>
    set((state) => ({
      prepSteps: state.prepSteps.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      )
    })),

  toggleHandoverStep: (handoverId, stepId) =>
    set((state) => ({
      handovers: state.handovers.map((h) => {
        if (h.id !== handoverId) return h
        const updatedSteps = h.steps.map((s) =>
          s.id === stepId ? { ...s, completed: !s.completed } : s
        )
        const allCompleted = updatedSteps.every((s) => s.completed)
        return { ...h, steps: updatedSteps, isCompleted: allCompleted }
      })
    })),

  takeSwap: (id, takerName) =>
    set((state) => ({
      swaps: state.swaps.map((s) =>
        s.id === id ? { ...s, status: 'taken' as const, takerName } : s
      )
    })),

  addPoints: (points) =>
    set((state) => ({ myPoints: state.myPoints + points }))
}))
