import { create } from 'zustand'

type toast = {
    toastState: boolean,
    toastStatus: string,
    displayToast: (value:boolean) => void,
    setToastStatus: (value: string) => void
}

export const useToast = create<toast>((set) => ({
    toastState: false,
    toastStatus: 'loading',
    displayToast: (value:boolean) => set((state) => ({
        toastState: value
    })),
    setToastStatus: (value: string) => set({
        toastStatus: value
    })

}))