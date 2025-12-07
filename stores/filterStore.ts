import { create } from 'zustand'

type filter = {
    displayFilter: boolean,
    setFilterDisplay: (value: boolean) => void,
}
export const useFilterStore = create<filter>((set) => ({
    displayFilter: false,
    setFilterDisplay: (value: boolean) => {
        set({
            displayFilter: value
        })
    },

})) 