import { create } from 'zustand'
import { ProductsInCartTypes } from '@/types/ProductsInCartTypes'
import { ProductsType } from '@/types/ProductTypes'
import { useToast } from './toastStore'
import { ProductsInCheckoutTypes } from '@/types/ProductsInCheckoutTypes'

type tempData = {
    email: string | null | undefined,
    products: ProductsType | null | undefined
}
type cart = {
    cartCount: number,
    addToCart: (email: string | null | undefined, products: ProductsType | null | undefined) => void,
    clearCart: () => void,
    fetchCartItems: (email: string | null | undefined) => void,
    cartItems: ProductsInCartTypes[],
    openCart: boolean,
    openCartToggle: () => void,
    tempData: tempData | null,
    storeTempData: (email: string | null | undefined, products: ProductsType | null | undefined) => void,
    retryAddtoCart: () => void,
    checkoutItems: ProductsInCheckoutTypes[],
    addToCheckout: (products: ProductsInCartTypes | null | undefined) => void,
    removeItemFromCheckoutItems: (products: ProductsInCartTypes | null | undefined) => void
}
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
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


        useToast.getState().displayToast(true)

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
                useToast.getState().setToastStatus('success')
                set((state) => ({
                    cartCount: state.cartCount + 1,
                    cartItems: [...state.cartItems, newCartItem],
                }))

            }
            if (response.status == 500 && !email) {

                useToast.getState().setToastStatus('notLogin')
                useCartStore.getState().storeTempData(email, products)

                if (toastTimeout != null) clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    useToast.getState().displayToast(false)
                }, 8000);
                console.log(toastTimeout)
            } else {
                useToast.getState().setToastStatus('success')
                if (toastTimeout != null) clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    useToast.getState().displayToast(false)
                }, 8000);
            }


        } catch (err) {
            useToast.getState().setToastStatus('failed');
            if (toastTimeout != null) clearTimeout(toastTimeout);
            toastTimeout = setTimeout((): void => {
                useToast.getState().displayToast(false)
            }, 8000);
            console.log(toastTimeout)

        }
    },


    clearCart: () => {
        set({
            cartCount: 0,
            cartItems: []
        })
    },




    openCart: false,


    openCartToggle: () => set((state) => ({
        openCart: !state.openCart
    })),



    tempData: { email: '', products: {} as ProductsType },


    storeTempData: (email: string | null | undefined, products: ProductsType | null | undefined) => set({
        tempData: { email, products }
    }),


    retryAddtoCart: () => {
        const email = useCartStore.getState().tempData?.email
        const products = useCartStore.getState().tempData?.products
        useCartStore.getState().addToCart(email, products)
    },
    checkoutItems: [],
    addToCheckout: (products: ProductsInCartTypes | null | undefined) => {
        console.log('gumana ung add')
        const newChecoutItems = {
            id: products?.id!,
            product_id: products?.product_id!,
            product_name: products?.product_name!,
            product_image: products?.product_image!,
            price: products?.price!,
            stocks: products?.stocks!,
        };
        set((state) => ({
            checkoutItems: [...state.checkoutItems, newChecoutItems],
        }))
    },
    removeItemFromCheckoutItems: (products: ProductsInCartTypes | null | undefined) => {
        console.log('gumana remove')
        const newChecoutItems = {
            id: products?.id!,
            product_id: products?.product_id!,
            product_name: products?.product_name!,
            product_image: products?.product_image!,
            price: products?.price!,
            stocks: products?.stocks!,
        };

        const newCheckoutItems = useCartStore.getState().checkoutItems.filter(products => products.id !== newChecoutItems.id)
        console.log(newCheckoutItems)
        set({
            checkoutItems: newCheckoutItems
        })

    }
}))