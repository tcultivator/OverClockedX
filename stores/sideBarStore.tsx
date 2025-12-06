import { create } from 'zustand'

type sideBarTypes = {
    sideBar: boolean,
    setSideBar: () => void,
}

export const useSideBarStore = create<sideBarTypes>((set) => ({
    sideBar: false,
    setSideBar: () => {
        set((state) => ({
            sideBar: !state.sideBar
        }))
    }
}))