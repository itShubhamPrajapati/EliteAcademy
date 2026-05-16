import { create } from 'zustand'

interface TestState {
  answers: Record<string, string>
  timeLeft: number
  setAnswer: (questionId: string, answer: string) => void
  setTimeLeft: (time: number) => void
  decrementTimer: () => void
  reset: () => void
}

export const useTestStore = create<TestState>((set) => ({
  answers: {},
  timeLeft: 0,
  setAnswer: (questionId, answer) => set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  setTimeLeft: (time) => set({ timeLeft: time }),
  decrementTimer: () => set((state) => ({ timeLeft: Math.max(state.timeLeft - 1, 0) })),
  reset: () => set({ answers: {}, timeLeft: 0 })
}))
