import { create } from 'zustand'

type data = {
    loading: string,
    buttonLoading: boolean,
    setLoading: (value: string) => void,
    setButtonLoading: (value: boolean) => void
}
export const useLoading = create<data>((set) => ({
    loading: '',
    setLoading: (value: string) => {
        set({ loading: value })
    },
    buttonLoading: false,
    setButtonLoading: (value: boolean) => {
        set({
            buttonLoading: value
        })
    }
}))