import { create } from 'zustand'
import { useLoading } from './loadingStore';
import { toast } from "sonner"
import { UserAddress } from '@/types/UserAddressTypes';
import { useAlertNotification } from './alertNotificationStore';
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
    CustomInput: () => void,
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
        useLoading.getState().setLoading('Getting user information...')
        const userAdressInfo = await fetch('/api/fetchUserAdress', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: useUserStore.getState().user?.email })
        })
        const response = await userAdressInfo.json()
        if (response.status != 500 && response.length > 0) {
            set({
                userAdress: response
            })
            useLoading.getState().setLoading('')
            toast.success("Successfully added shipping information", {
                description: "Your shipping information has been updated! please double check it before checkout!",
            })
        } else {

            useLoading.getState().setLoading('')
            useAlertNotification.getState().setErrorMessageDisplay({
                display: true,
                title: 'No Address Found!',
                message: 'Please check if you have a registered address'
            })

        }

    },
    CustomInput: () => {
        set({
            userAdress: []
        })
    },

    addCustomAddress: (value: UserAddress[]) => {
        set({ userAdress: value })
        toast.success("Successfully added shipping information", {
            description: "Your shipping information has been updated! please double check it before checkout!",
        })
    },

}))