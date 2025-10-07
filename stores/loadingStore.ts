import { create } from 'zustand'

type data = {
    loading: string,
    setLoading: (value: string) => void
}
export const useLoading = create<data>((set) => ({
    loading: '',
    setLoading: (value: string) => {
        set({ loading: value })
    }
}))