import { create } from 'zustand'


type userDataTypesFromGoogle = {
    email: string;
    name: string;
    image: string | null | undefined;
}
type useStore = {
    user: userDataTypesFromGoogle | null,
    setUser: (loginUser: userDataTypesFromGoogle) => void,
    clearUser: () => void
}

export const useUserStore = create<useStore>((set) => ({
    user: null,
    setUser: (loginUser: userDataTypesFromGoogle) => {
        set({ user: loginUser })
    },
    clearUser: () => set({ user: null })
}))