import { create } from 'zustand'
import { ProductsInCartTypes } from '@/types/ProductsInCartTypes'
import { ProductsType } from '@/types/ProductTypes'

type cart = {
    cartCount: number,
    addToCart: (email: string | null | undefined, products: ProductsType | null | undefined) => void,
    clearCart: () => void,
    fetchCartItems: (email: string | null | undefined) => void,
    cartItems: ProductsInCartTypes[]
}

export const useCartStore = create<cart>((set) => ({
    cartCount: 0,
    cartItems: [],
    //this get the items in the cart of a user if login, if not login the default value should be zero
    fetchCartItems: async (email: string | null | undefined) => {
        try {
            const fetchCartItems = await fetch('/api/fetchCartItems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            })
            const response: ProductsInCartTypes[] = await fetchCartItems.json()
            set({
                cartCount: response.length,
                cartItems: response
            })

        } catch (err) {
            set({
                cartCount: 0,
                cartItems: []
            })
        }
    },

    addToCart: async (email: string | null | undefined, products: ProductsType | null | undefined) => {
        try {
            console.log('eto ung laman sa kapag add to cart')
            console.log(email)
            console.log(products)
            const addtocart = await fetch('/api/addToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, product_id: products?.product_id })

            })
            const response = await addtocart.json()
            console.log('ano to', response)
            const newCartItem = {
                id: products?.id!,
                email: email!,
                product_id: products?.product_id!,
                product_name: products?.product_name!,
                product_image: products?.product_image!,
                price: products?.price!,
                stocks: products?.stocks!,
            };
            if (response.status == 201) {
                set((state) => ({
                    cartCount: state.cartCount + 1,
                    cartItems: [...state.cartItems, newCartItem],
                }))
            }

        } catch (err) {

        }
    },
    clearCart: () => {
        set({
            cartCount: 0,
            cartItems: []
        })
    }
}))