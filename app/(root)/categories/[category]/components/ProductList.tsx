"use client";
import React, { useState, useRef } from 'react'
import { ProductsType } from '@/types/ProductTypes';
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import CategoriesHeader from '@/components/Categories/CategoriesHeader';
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation';
import { TfiShoppingCart } from "react-icons/tfi";
import { ClipLoader } from 'react-spinners';

//shared states using zustand
import { useCartStore } from '@/stores/cartStore';
import { useUserStore } from '@/stores/userStore';
import { useToast } from '@/stores/toastStore';
import { useCategoriesHeaderStore } from '@/stores/categoriesHeaderStore';


type Props = {
    products: ProductsType[]
    category: string
}
const ProductList = ({ products, category }: Props) => {


    const router = useRouter();
    const [finalProducts, setFinalProducts] = useState(products)
    const searchParams = useSearchParams();
    const [loadingProducts, setLoadingProducts] = useState(false)

    const addToCart = useCartStore((state) => state.addToCart)
    const user = useUserStore((state) => state.user)
    const toastState = useToast((state) => state.toastState)
    const [loading, setLoading] = useState(false)
    const [offset, setOffset] = useState(0);
    const offsetRef = useRef(0);
    const [noProductMessage, setNoProductMessage] = useState(false)

    const loadingRef = useRef(false);
    const noProductMessageRef = useRef(false);

    useEffect(() => {
        const SortBy = searchParams.get('Sortby') || ''
        const Availability = searchParams.get('availability') || ''
        const low = searchParams.get('low') || ''
        const high = searchParams.get('high') || ''
        const brands = searchParams.get('brands') || ''
        setOffset(0)
        offsetRef.current = 0;
        setNoProductMessage(false)
        noProductMessageRef.current = false;
        console.log('eto ung offset ', offsetRef.current)
        const arrayBrands = brands.split(',')
        console.log(arrayBrands)

        setLoadingProducts(true)
        const getFilter = async () => {
            const res = await fetch('/api/filterProducts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category: category, SortBy: SortBy, Availability: Availability, low: low, high: high, offset: offsetRef.current, brands: arrayBrands }),
            })
            const response = await res.json()
            setFinalProducts(response.result)
            setOffset(prev => {
                const newOffset = prev + 10;
                offsetRef.current = newOffset;
                return newOffset;
            });
            setTimeout(() => {
                setLoadingProducts(false)
            }, 1000);

        }

        getFilter()

    }, [searchParams, category])




    const productListDisplayOrientation = useCategoriesHeaderStore((state) => state.productListDisplayOrientation)
    const listRef = useRef<HTMLDivElement | null>(null);






    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        noProductMessageRef.current = noProductMessage;
    }, [noProductMessage]);

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) return;

        const detectScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = listElement;

            const isAtBottom = scrollTop + clientHeight >= scrollHeight;
            if (isAtBottom && !loadingRef.current && !noProductMessageRef.current) {
                loadingRef.current = true; // prevent double fetches
                setLoading(true);
                console.log('Trigger fetch');
                setTimeout(() => {
                    console.log('gagana lang to kapag nag loloading or nag fefetch na ng data')
                    console.log('eto ung offset ', offsetRef.current)
                    const SortBy = searchParams.get('Sortby') || ''
                    const Availability = searchParams.get('availability') || ''
                    const low = searchParams.get('low') || ''
                    const high = searchParams.get('high') || ''
                    const brands = searchParams.get('brands') || ''
                    const arrayBrands = brands.split(',')
                    console.log('eto ung sa infinite scrolling')
                    const getFilter = async () => {
                        const res = await fetch('/api/filterProducts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ category: category, SortBy: SortBy, Availability: Availability, low: low, high: high, offset: offsetRef.current, brands: arrayBrands }),
                        })
                        const response = await res.json()
                        setFinalProducts(prev => [...prev, ...response.result])
                        setOffset(prev => {
                            const newOffset = prev + 10;
                            offsetRef.current = newOffset;
                            return newOffset;
                        });

                        setLoading(false);
                        loadingRef.current = false;

                        if (response.result.length === 0) {
                            setNoProductMessage(true);
                            noProductMessageRef.current = true;
                            console.log('No more products.');
                        }

                    }
                    getFilter()
                    console.log('nasababa na ung scroll')
                }, 3000);

            }
        }
        listElement.addEventListener('scroll', detectScroll);
        return () => listElement.removeEventListener('scroll', detectScroll);
    }, [])
    return (
        <div className='flex flex-col max-h-[75vh] bg-black inset-shadow-sm inset-shadow-white/50 rounded-[10px]  justify-start w-full font-thin md:max-h-[88vh]'>
            <CategoriesHeader />
            <div ref={listRef} className='overflow-y-auto'>
                <div id="right" className={`${loadingProducts ? 'opacity-25' : 'opacity-100'} ${productListDisplayOrientation[0]}`}>
                    {loadingProducts ? (
                        finalProducts && finalProducts.map((data, index) => (
                            < div className="flex flex-col gap-3 space-y-3" key={index}>
                                <Skeleton className="h-[125px] w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[60%]" />
                                </div>
                            </div >
                        ))
                    ) : (
                        finalProducts && finalProducts.map((data, index) => (
                            <div key={index} className={`${productListDisplayOrientation[1]}`}>
                                <div className={`${productListDisplayOrientation[2]}`} onClick={() => router.push(`/product/${data.product_id}`)} >
                                    <div className={`${productListDisplayOrientation[3]}`}>
                                        <div className={`${productListDisplayOrientation[6]}`}>
                                            <Image src={data.product_image} alt='' className='w-full h-full max-w-xs' width={400} height={400} />
                                        </div>
                                        <div className='flex flex-col'>
                                            <label className='text-xs'>{data.product_name}</label>
                                            <label className="text-sm md:text-2xl">
                                                {new Intl.NumberFormat('en-PH', {
                                                    style: 'currency',
                                                    currency: 'PHP',
                                                }).format(data.price)}
                                            </label>
                                        </div>

                                    </div>
                                </div>
                                <div className={`${productListDisplayOrientation[4]}`}>
                                    <button disabled={toastState} onClick={() => {
                                        addToCart({
                                            id: data.id,
                                            email: user?.email,
                                            product_id: data.product_id,
                                            product_name: data.product_name,
                                            product_image: data.product_image,
                                            price: data.price,
                                            stocks: data.stocks,
                                            quantity: 1
                                        })
                                    }} className={`${productListDisplayOrientation[5]}`}><TfiShoppingCart className='text-[15px]' /> Add to cart</button>
                                </div>

                            </div>

                        ))
                    )

                    }

                </div>
                {loading && !noProductMessage && <div className='w-full flex justify-center items-center gap-2 pb-5'><ClipLoader
                    size={25}
                    color='white'
                    loading={true} />Loading...</div>}
                {noProductMessage && <div className='w-full flex justify-center items-center gap-2 pb-5'>No more products</div>}
            </div>


        </div>


    )

}

export default ProductList
