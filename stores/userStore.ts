import { create } from 'zustand'
interface UserAddress {
    email: string;
    rname: string;
    phone_number: string;
    country: string;
    cityMunicipality: string;
    barangay: string;
    province: string;
    trademark: string;
}

type userDataTypesFromGoogle = {
    email: string;
    name: string;
    image: string | null | undefined;
}
type useStore = {
    user: userDataTypesFromGoogle | null,
    setUser: (loginUser: userDataTypesFromGoogle) => void,
    clearUser: () => void,
    userAdress: UserAddress[],
    addToUserAdress: () => void,
    useCustomInput: () => void,
    addCustomAddress: (value: UserAddress[]) => void,
}

export const useUserStore = create<useStore>((set) => ({
    user: null,
    setUser: (loginUser: userDataTypesFromGoogle) => {
        set({ user: loginUser })
    },
    clearUser: () => set({ user: null }),
    userAdress: [],
    addToUserAdress: async () => {

        const userAdressInfo = await fetch('/api/fetchUserAdress', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: useUserStore.getState().user?.email })
        })
        const response = await userAdressInfo.json()
        set({
            userAdress: response
        })
    },
    useCustomInput: () => {
        set({
            userAdress: []
        })
    },

    addCustomAddress: (value: UserAddress[]) => {
        set({ userAdress: value })
    },
}))