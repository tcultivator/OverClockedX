import { create } from 'zustand'
import { ProductsInCartTypes } from '@/types/ProductsInCartTypes'
import { ProductsType } from '@/types/ProductTypes'
import { useToast } from './toastStore'
import { ProductsInCheckoutTypes } from '@/types/ProductsInCheckoutTypes'
import { useUserStore } from './userStore'
import { useLoading } from './loadingStore'
import { FaBullseye } from 'react-icons/fa'

type tempData = {
    products: ProductsInCartTypes | null | undefined
}
type cart = {
    cartItems: ProductsInCartTypes[],

    seperateItem: ProductsInCheckoutTypes[],

    openCart: boolean,

    tempData: tempData | null,

    checkoutItems: ProductsInCheckoutTypes[],

    finalCheckoutItems: ProductsInCheckoutTypes[],

    addToCart: (products: ProductsInCartTypes | null | undefined) => void,

    clearCart: () => void,

    fetchCartItems: (email: string | null | undefined) => void,

    openCartToggle: () => void,

    storeTempData: (products: ProductsInCartTypes | null | undefined) => void,

    retryAddtoCart: () => void,

    addToCheckout: (products: ProductsInCartTypes | null | undefined) => void,

    removeItemFromCheckoutItems: (products: ProductsInCartTypes | null | undefined) => void,

    removeItemInCart: (products: ProductsInCartTypes | null | undefined) => void,

    addToFinalCheckout: () => void,

    clearSelectedItemsInCart: () => void,

    addToSeperateItem: (products: ProductsInCartTypes | null | undefined) => void,

    clearSeperateItem: () => void,

    updateQuantityOfFinalCheckoutItem: (operator: boolean, product_id: string) => void,

    removeItemFromFinalCheckoutItems: (product_id: string) => void,

    clearUserCartInSignout: () => void,
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



    addToCart: async (products: ProductsInCartTypes | null | undefined) => {


        useToast.getState().displayToast(true)

        try {

            const addtocart = await fetch('/api/addToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: products?.email, product_id: products?.product_id, quantity: products?.quantity })

            })
            const response = await addtocart.json()
            const newCartItem = {
                id: products?.id!,
                email: products?.email!,
                product_id: products?.product_id!,
                product_name: products?.product_name!,
                product_image: products?.product_image!,
                price: products?.price!,
                stocks: products?.stocks!,
                quantity: products?.quantity!,
            };

            if (response.status == 201) {
                useToast.getState().setToastStatus('success')
                set((state) => ({
                    cartItems: [...state.cartItems, newCartItem],
                }))
                if (toastTimeout != null) clearTimeout(toastTimeout);
                toastTimeout = setTimeout((): void => {
                    useToast.getState().displayToast(false)
                }, 1000);


            }
            else if (response.status == 500 && !products?.email) {
                useToast.getState().setToastStatus('notLogin')
                useCartStore.getState().storeTempData(products)

                if (toastTimeout != null) clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    useToast.getState().displayToast(false)
                }, 5000);

            } else if (response.status == 200) {
                useToast.getState().setToastStatus('success')
                const updatedCartItems = useCartStore.getState().cartItems.map(item =>
                    item.product_id == newCartItem.product_id ? { ...item, quantity: item.quantity + 1 } :
                        item
                )
                set({ cartItems: updatedCartItems })
                if (toastTimeout != null) clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    useToast.getState().displayToast(false)
                }, 1000);

            }


        } catch (err) {
            useToast.getState().setToastStatus('failed');
            if (toastTimeout != null) clearTimeout(toastTimeout);
            toastTimeout = setTimeout((): void => {
                useToast.getState().displayToast(false)
            }, 5000);


        }
    },


    clearCart: async () => {
        useLoading.getState().setLoading('Deleting cart items...')
        const clearCartItems = await fetch('/api/clearCart', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: useUserStore.getState().user?.email })
        })
        const response = await clearCartItems.json()
        if (response.status == 200) {
            console.log('success')
            useLoading.getState().setLoading('')
            set({
                cartItems: []
            })

        }

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
                quantity: products?.quantity!,
            };
            const email = useUserStore.getState().user?.email

            const newCartItems = useCartStore.getState().cartItems.filter(products => products.product_id !== ItemFromCartNeedToRemove.product_id)


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



    tempData: { products: {} as ProductsInCartTypes },


    storeTempData: (products: ProductsInCartTypes | null | undefined) => set({
        tempData: { products }
    }),


    retryAddtoCart: () => {
        const products = useCartStore.getState().tempData?.products
        useCartStore.getState().addToCart(products)
    },
    checkoutItems: [],
    addToCheckout: (products: ProductsInCartTypes | null | undefined) => {

        const newChecoutItems = {
            id: products?.id!,
            product_id: products?.product_id!,
            product_name: products?.product_name!,
            product_image: products?.product_image!,
            price: products?.price!,
            stocks: products?.stocks!,
            quantity: products?.quantity!,
        };
        set((state) => ({
            checkoutItems: [...state.checkoutItems, newChecoutItems],
        }))
    },
    removeItemFromCheckoutItems: (products: ProductsInCartTypes | null | undefined) => {

        const newChecoutItemss = {
            id: products?.id!,
            product_id: products?.product_id!,
            product_name: products?.product_name!,
            product_image: products?.product_image!,
            price: products?.price!,
            stocks: products?.stocks!,
        };

        const newCheckoutItems = useCartStore.getState().checkoutItems.filter(products => products.product_id !== newChecoutItemss.product_id)
        console.log(newCheckoutItems)
        set({
            checkoutItems: newCheckoutItems
        })

    },
    clearSelectedItemsInCart: () => {
        set({ checkoutItems: [] })
    },
    finalCheckoutItems: [],
    addToFinalCheckout: () => {

        const newSeperatedItem = useCartStore.getState().seperateItem
        const finalCheckouts = useCartStore.getState().checkoutItems

        if (newSeperatedItem.length < 1) {

            set({
                finalCheckoutItems: finalCheckouts,
            })


        } else {

            set({
                finalCheckoutItems: newSeperatedItem,
            })
            useCartStore.getState().clearSeperateItem()
        }


    },

    seperateItem: [],
    addToSeperateItem: (products: ProductsInCartTypes | null | undefined) => {
        const newChecoutItems = {
            id: products?.id!,
            product_id: products?.product_id!,
            product_name: products?.product_name!,
            product_image: products?.product_image!,
            price: products?.price!,
            stocks: products?.stocks!,
            quantity: products?.quantity!,
            value: products?.value!
        };
        set({
            seperateItem: [newChecoutItems]
        })
        useCartStore.getState().addToFinalCheckout()
    },
    clearSeperateItem: () => {
        set({
            seperateItem: []
        })
    },

    updateQuantityOfFinalCheckoutItem: (operator: boolean, product_id: string) => {
        const updatedFinalCheckoutItems = useCartStore.getState().finalCheckoutItems.map(item =>
            operator ? (item.product_id == product_id ? {
                ...item, quantity: item.quantity + 1
            } :
                item) : (
                item.product_id == product_id ? {
                    ...item, quantity: item.quantity - 1
                } :
                    item
            )
        )
        set({ finalCheckoutItems: updatedFinalCheckoutItems })
    },

    removeItemFromFinalCheckoutItems: (product_id: string) => {
        if (useCartStore.getState().finalCheckoutItems.length > 1) {
            const newCheckoutItems = useCartStore.getState().finalCheckoutItems.filter(products => products.product_id !== product_id)
            console.log(newCheckoutItems)
            set({
                finalCheckoutItems: newCheckoutItems
            })
        }
    },

    clearUserCartInSignout: () => {
        set({
            cartItems: []
        })
    }

}))