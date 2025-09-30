import { create } from 'zustand'


type cart = {
    cartCount: number,
    addToCart: () => void,
    removeCart: () => void
}
export const useCartStore = create<cart>((set) => ({
    cartCount: 0,
    addToCart: () => set((state) => ({
        cartCount: state.cartCount + 1
    })),
    removeCart: () => set((state) => ({
        cartCount: state.cartCount - 1
    }))
}))