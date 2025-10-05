import { create } from 'zustand'
import { ProductsInCartTypes } from '@/types/ProductsInCartTypes'
import { ProductsType } from '@/types/ProductTypes'
import { useToast } from './toastStore'
import { ProductsInCheckoutTypes } from '@/types/ProductsInCheckoutTypes'
import { useUserStore } from './userStore'

type tempData = {
    email: string | null | undefined,
    products: ProductsType | null | undefined
}
type cart = {
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
    removeItemFromCheckoutItems: (products: ProductsInCartTypes | null | undefined) => void,
    removeItemInCart: (products: ProductsInCartTypes | null | undefined) => void,
    finalCheckoutItems: ProductsInCheckoutTypes[],
    addToFinalCheckout: () => void
}
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
export const useCartStore = create<cart>((set) => ({
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
                cartItems: response
            })

        } catch (err) {
            set({
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
                }, 2000);
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
            cartItems: []
        })
    },

    removeItemInCart: async (products: ProductsInCartTypes | null | undefined) => {
        const cartItemsForRollback = useCartStore.getState().cartItems
        try {
            const ItemFromCartNeedToRemove = {
                id: products?.id!,
                product_id: products?.product_id!,
                product_name: products?.product_name!,
                product_image: products?.product_image!,
                price: products?.price!,
                stocks: products?.stocks!,
            };
            const email = useUserStore.getState().user?.email

            const newCartItems = useCartStore.getState().cartItems.filter(products => products.product_id !== ItemFromCartNeedToRemove.product_id)
            console.log(newCartItems)

            //this remove the item from cart, this run first before fetch call that remove that item in database
            set({
                cartItems: newCartItems
            })

            //this ensure that if the item in cart is remove and user is currently selected that to checkout, this remove that item from checkout items as well
            const newCheckoutItems = useCartStore.getState().checkoutItems.filter(products => products.product_id !== ItemFromCartNeedToRemove.product_id)
            console.log(newCheckoutItems)
            set({
                checkoutItems: newCheckoutItems
            })


            //this is the fetch call that remove item from database
            const removeitemfromcart = await fetch('/api/removeFromCart', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email: email, product_id: ItemFromCartNeedToRemove.product_id })
            })
            const response = await removeitemfromcart.json()
            if (response.status == 200) {
                console.log('success')
            } else {
                //this is a rollback, if remove item from cart fails
                set({
                    cartItems: cartItemsForRollback
                })
            }


        } catch (err) {
            console.log('error removing item in cart', err)
            //this is a rollback, if remove item from cart fails
            set({
                cartItems: cartItemsForRollback
            })
        }
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

        const newCheckoutItems = useCartStore.getState().checkoutItems.filter(products => products.product_id !== newChecoutItems.product_id)
        console.log(newCheckoutItems)
        set({
            checkoutItems: newCheckoutItems
        })

    },
    finalCheckoutItems: [],
    addToFinalCheckout: () => {
        console.log('gumana ung add')
        const finalCheckouts = useCartStore.getState().checkoutItems
        set({
            finalCheckoutItems: finalCheckouts,
        })
    },

}))