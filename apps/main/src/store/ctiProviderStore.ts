import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CtiData } from './ctiStore'

interface CtiProviderState {
  ctiProviderItems: CtiData[]
  setCtiProviderItems: (ctiProviderItems: CtiData[]) => void
  updateCtiProviderItem: (ctiId: string, updateCti: CtiData) => void
  addToCtiProvider: (cti: CtiData) => void
  removeFromCtiProvider: (ctiId: string) => void
  clearCtiProvider: () => void
  initializeCtiProvider: () => Promise<void>
}


export const useCtiProviderStore = create<CtiProviderState>()(
  persist(
    (set) => ({
      ctiProviderItems: [],
      setCtiProviderItems: (ctiProviderItems: CtiData[]) => set({ ctiProviderItems }),
      updateCtiProviderItem: (ctiId: string, updateCti: CtiData) => set((state) => ({
        ctiProviderItems: state.ctiProviderItems.map(item => item.ctiId === ctiId ? updateCti : item)
      })),
      addToCtiProvider: (cti) => 
        set((state) => {
          // 检查是否已经存在
          const exists = state.ctiProviderItems.some(item => item.ctiId === cti.ctiId)
          if (!exists) {
            return { ctiProviderItems: [...state.ctiProviderItems, cti] }
          }
          return state
        }),
      removeFromCtiProvider: (ctiId) =>
        set((state) => ({
          ctiProviderItems: state.ctiProviderItems.filter((item) => item.ctiId !== ctiId)
        })),
      clearCtiProvider: () => set({ ctiProviderItems: [] }),
      initializeCtiProvider: async () => {
        const storedItems = localStorage.getItem('cti-provider');
        if (!storedItems || JSON.parse(storedItems).ctiProviderItems.length === 0) {
          // const res = await mockFetchUserCTI();
          // set({ ctiProviderItems: res.cti_infos });
        }
      }
    }),
    {
      name: 'cti-provider',
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
