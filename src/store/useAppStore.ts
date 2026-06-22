import { create } from 'zustand'
import { TaskItem, PrepStep, HandoverItem, SwapRequest, FeedbackItem } from '@/types'
import { mockTasks } from '@/data/tasks'
import { mockPrepSteps } from '@/data/preparations'
import { mockHandovers } from '@/data/handovers'
import { mockSwaps } from '@/data/swaps'
import { mockFeedbacks } from '@/data/rankings'

interface AppState {
  tasks: TaskItem[]
  prepSteps: PrepStep[]
  handovers: HandoverItem[]
  swaps: SwapRequest[]
  feedbacks: FeedbackItem[]
  myPoints: number
  claimedPoints: Set<string>
  prepConfirmed: boolean

  updateTaskStatus: (id: string, status: TaskItem['status']) => void
  togglePrepStep: (id: string) => void
  confirmPrep: () => boolean
  toggleHandoverStep: (handoverId: string, stepId: string) => boolean
  completeHandover: (handoverId: string) => boolean
  setHandoverEnergy: (handoverId: string, energy: string) => void
  submitHandoverEnergy: (handoverId: string, energy: string) => boolean
  takeSwap: (id: string, takerName: string) => boolean
  publishSwap: (data: { shiftDate: string; shiftTime: string; equipment: string; reason: string; points: number }) => void
  publishFeedback: (data: { content: string; category: 'praise' | 'suggestion' | 'issue' }) => void
  likeFeedback: (id: string) => void
}

const initialFeedbacks: FeedbackItem[] = mockFeedbacks.map(f => ({ ...f, likedByMe: false }))
const initialHandovers: HandoverItem[] = mockHandovers.map(h => ({ ...h, energyInput: '' }))

export const useAppStore = create<AppState>((set, get) => ({
  tasks: mockTasks,
  prepSteps: mockPrepSteps,
  handovers: initialHandovers,
  swaps: mockSwaps,
  feedbacks: initialFeedbacks,
  myPoints: 2450,
  claimedPoints: new Set<string>(),
  prepConfirmed: false,

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

  confirmPrep: () => {
    const state = get()
    const allDone = state.prepSteps.every(s => s.completed)
    if (!allDone) return false
    if (state.prepConfirmed) {
      return false
    }
    const key = 'prep_confirm'
    if (state.claimedPoints.has(key)) {
      set({ prepConfirmed: true })
      return true
    }
    set({
      prepConfirmed: true,
      myPoints: state.myPoints + 20,
      claimedPoints: new Set([...state.claimedPoints, key])
    })
    return true
  },

  toggleHandoverStep: (handoverId, stepId) => {
    const state = get()
    const handover = state.handovers.find(h => h.id === handoverId)
    if (!handover) return false
    const step = handover.steps.find(s => s.id === stepId)
    if (!step || step.completed) return false

    const allOtherDone = handover.steps
      .filter(s => s.id !== stepId)
      .every(s => s.completed)
    const wouldComplete = allOtherDone && !step.completed

    if (wouldComplete) {
      const key = `handover_complete_${handoverId}`
      if (state.claimedPoints.has(key)) {
        set((s) => ({
          handovers: s.handovers.map((h) => {
            if (h.id !== handoverId) return h
            const updatedSteps = h.steps.map((st) =>
              st.id === stepId ? { ...st, completed: !st.completed } : st
            )
            const allCompleted = updatedSteps.every((st) => st.completed)
            return { ...h, steps: updatedSteps, isCompleted: allCompleted }
          })
        }))
        return true
      }
      set((s) => ({
        handovers: s.handovers.map((h) => {
          if (h.id !== handoverId) return h
          const updatedSteps = h.steps.map((st) =>
            st.id === stepId ? { ...st, completed: !st.completed } : st
          )
          const allCompleted = updatedSteps.every((st) => st.completed)
          return { ...h, steps: updatedSteps, isCompleted: allCompleted }
        }),
        myPoints: s.myPoints + 10,
        claimedPoints: new Set([...s.claimedPoints, key])
      }))
      return true
    }

    set((s) => ({
      handovers: s.handovers.map((h) => {
        if (h.id !== handoverId) return h
        const updatedSteps = h.steps.map((st) =>
          st.id === stepId ? { ...st, completed: !st.completed } : st
        )
        const allCompleted = updatedSteps.every((st) => st.completed)
        return { ...h, steps: updatedSteps, isCompleted: allCompleted }
      })
    }))
    return true
  },

  completeHandover: (handoverId) => {
    const state = get()
    const handover = state.handovers.find(h => h.id === handoverId)
    if (!handover) return false
    if (handover.isCompleted) return false
    const key = `handover_complete_${handoverId}`
    if (state.claimedPoints.has(key)) return false
    set((s) => ({
      myPoints: s.myPoints + 10,
      claimedPoints: new Set([...s.claimedPoints, key])
    }))
    return true
  },

  setHandoverEnergy: (handoverId, energy) =>
    set((state) => ({
      handovers: state.handovers.map(h =>
        h.id === handoverId ? { ...h, energyInput: energy } : h
      )
    })),

  submitHandoverEnergy: (handoverId, energy) => {
    if (!energy.trim()) return false
    const state = get()
    const handover = state.handovers.find(h => h.id === handoverId)
    if (!handover) return false

    const energyStep = handover.steps.find(s => s.type === 'energy')
    if (energyStep?.completed) return false

    const key = `energy_${handoverId}`
    if (state.claimedPoints.has(key)) return false

    set((s) => ({
      handovers: s.handovers.map((h) => {
        if (h.id !== handoverId) return h
        const updatedSteps = h.steps.map((st) =>
          st.type === 'energy'
            ? { ...st, completed: true, title: `填写能量档位 ${energy}` }
            : st
        )
        const allCompleted = updatedSteps.every((st) => st.completed)
        const wasCompleted = h.isCompleted
        return { ...h, steps: updatedSteps, energyInput: energy, isCompleted: allCompleted, ...(wasCompleted && !allCompleted ? { isCompleted: allCompleted } : {}) }
      }),
      tasks: s.tasks.map(t =>
        t.id === handover.taskRef ? { ...t, energyLevel: energy } : t
      ),
      myPoints: s.myPoints + 5,
      claimedPoints: new Set([...s.claimedPoints, key])
    }))
    return true
  },

  takeSwap: (id, takerName) => {
    const state = get()
    const swap = state.swaps.find(s => s.id === id)
    if (!swap || swap.status !== 'open') return false
    const key = `swap_take_${id}`
    if (state.claimedPoints.has(key)) return false
    set((s) => ({
      swaps: s.swaps.map((sr) =>
        sr.id === id ? { ...sr, status: 'taken' as const, takerName } : sr
      ),
      myPoints: s.myPoints + swap.points,
      claimedPoints: new Set([...s.claimedPoints, key])
    }))
    return true
  },

  publishSwap: (data) => {
    const state = get()
    const now = new Date()
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const newSwap: SwapRequest = {
      id: `s_new_${Date.now()}`,
      requesterName: '小李',
      requesterAvatar: 'https://picsum.photos/id/64/200/200',
      shiftDate: data.shiftDate,
      shiftTime: data.shiftTime,
      equipment: data.equipment,
      reason: data.reason,
      status: 'open',
      createdAt,
      points: data.points
    }
    set({ swaps: [newSwap, ...state.swaps] })
  },

  publishFeedback: (data) => {
    const state = get()
    const now = new Date()
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const newFeedback: FeedbackItem = {
      id: `f_new_${Date.now()}`,
      authorName: '小李',
      authorAvatar: 'https://picsum.photos/id/64/200/200',
      content: data.content,
      category: data.category,
      createdAt,
      likes: 0,
      likedByMe: false
    }
    set({ feedbacks: [newFeedback, ...state.feedbacks] })
  },

  likeFeedback: (id) => {
    set((state) => ({
      feedbacks: state.feedbacks.map(f => {
        if (f.id !== id) return f
        if (f.likedByMe) {
          return { ...f, likes: Math.max(0, f.likes - 1), likedByMe: false }
        }
        return { ...f, likes: f.likes + 1, likedByMe: true }
      })
    }))
  }
}))
