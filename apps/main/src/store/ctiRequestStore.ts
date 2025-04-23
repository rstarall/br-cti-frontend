import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CtiData } from './ctiStore'


interface CtiRequestState {
  ctiRequestItems: CtiData[]
  updateCtiRequestItem: (ctiId: string, updateCti: CtiData) => void
  addToCtiRequest: (cti: CtiData) => void
  removeFromCtiRequest: (ctiId: string) => void
  clearCtiRequest: () => void
  initializeCtiRequest: () => Promise<void>
}

export const useCtiRequestStore = create<CtiRequestState>()(
  persist(
    (set) => ({
      ctiRequestItems: [],
      updateCtiRequestItem: (ctiId: string, updateCti: CtiData) => set((state) => ({
        ctiRequestItems: state.ctiRequestItems.map(item => item.ctiId === ctiId ? updateCti : item)
      })),
      addToCtiRequest: (cti) => 
        set((state) => {
          // 检查是否已经存在
          const exists = state.ctiRequestItems.some(item => item.ctiId === cti.ctiId)
          if (!exists) {
            return { ctiRequestItems: [cti,...state.ctiRequestItems] }
          }
          return state
        }),
      removeFromCtiRequest: (ctiId) =>
        set((state) => ({
          ctiRequestItems: state.ctiRequestItems.filter((item) => item.ctiId !== ctiId)
        })),
      clearCtiRequest: () => set({ ctiRequestItems: [] }),
      initializeCtiRequest: async () => {
      }
    }),
    {
      name: 'cti-request',
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
)
