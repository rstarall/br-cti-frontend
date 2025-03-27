import { create } from 'zustand'

interface GlobalState {
  clientServerHost: string
  blockchainServerHost: string
  setClientServerHost: (host: string) => void
  setBlockchainServerHost: (host: string) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  clientServerHost: localStorage.getItem('clientServerHost') || 'http://127.0.0.1:5000',
  blockchainServerHost: localStorage.getItem('blockchainServerHost') || 'http://127.0.0.1:7777',
  setClientServerHost: (host) => {
    localStorage.setItem('clientServerHost', host)
    set({ clientServerHost: host })
  },
  setBlockchainServerHost: (host) => {
    localStorage.setItem('blockchainServerHost', host)
    set({ blockchainServerHost: host })
  }
}))
