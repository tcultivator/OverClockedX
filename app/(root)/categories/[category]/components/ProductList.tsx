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
import { Label } from '@/components/ui/label';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
    products: ProductsType[]
    category: string
}
const ProductList = ({ products, category }: Props) => {


    const router = useRouter();
    const [finalProducts, setFinalProducts] = useState(products)
    const [categories, setCategory] = useState(category)
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
        const search = searchParams.get('search') || ''
        setOffset(0)
        offsetRef.current = 0;
        setNoProductMessage(false)
        noProductMessageRef.current = false;
        const arrayBrands = brands.split(',')
        setLoadingProducts(true)
        const getFilter = async () => {
            const res = await fetch('/api/filterProducts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category: categories, SortBy: SortBy, Availability: Availability, low: low, high: high, offset: offsetRef.current, brands: arrayBrands, search: search }),
            })
            const response = await res.json()
            setFinalProducts(response.result)
            setOffset(prev => {
                const newOffset = prev + 18;
                offsetRef.current = newOffset;
                return newOffset;
            });
            setTimeout(() => {
                setLoadingProducts(false)
            }, 1000);

        }

        getFilter()

    }, [searchParams, categories])

    const productListDisplayOrientation = useCategoriesHeaderStore((state) => state.productListDisplayOrientation)
    const isList = useCategoriesHeaderStore((state) => state.isList)
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

            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
            if (isAtBottom && !loadingRef.current && !noProductMessageRef.current && !loadingProducts) {
                loadingRef.current = true; // prevent double fetches
                setLoading(true);
                setTimeout(() => {
                    const SortBy = searchParams.get('Sortby') || ''
                    const Availability = searchParams.get('availability') || ''
                    const low = searchParams.get('low') || ''
                    const high = searchParams.get('high') || ''
                    const brands = searchParams.get('brands') || ''
                    const arrayBrands = brands.split(',')
                    const search = searchParams.get('search') || ''
                    const getFilter = async () => {
                        const res = await fetch('/api/filterProducts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ category: categories, SortBy: SortBy, Availability: Availability, low: low, high: high, offset: offsetRef.current, brands: arrayBrands, search: search }),
                        })
                        const response = await res.json()
                        setFinalProducts(prev => [...prev, ...response.result])
                        setOffset(prev => {
                            const newOffset = prev + 18;
                            offsetRef.current = newOffset;
                            return newOffset;
                        });

                        setLoading(false);
                        loadingRef.current = false;

                        if (response.result.length === 0) {
                            setNoProductMessage(true);
                            noProductMessageRef.current = true;

                        }

                    }
                    getFilter()

                }, 3000);

            }
        }
        listElement.addEventListener('scroll', detectScroll);
        return () => listElement.removeEventListener('scroll', detectScroll);
    }, [])
    return (
        <div className='flex flex-col max-h-[85vh] text-black rounded justify-start w-full font-thin md:max-h-[92vh]'>
            <CategoriesHeader />
            <div ref={listRef} className='overflow-y-auto z-0'>
                <div id="right" className={`${loadingProducts ? 'opacity-25' : 'opacity-100'} ${productListDisplayOrientation[0]}`}>
                    {loadingProducts ? (
                        finalProducts && finalProducts.map((data, index) => (
                            < div className="flex flex-col gap-3 space-y-3" key={index}>
                                <Skeleton className="h-50 w-full rounded-xl bg-black/50" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[90%] bg-black/50" />
                                    <Skeleton className="h-4 w-[60%] bg-black/50" />
                                </div>
                            </div >
                        ))
                    ) : (

                        finalProducts.length > 0 ? finalProducts.map((data, index) => (
                            <div key={index} className={`${productListDisplayOrientation[1]} group`}>
                                <div className={`${productListDisplayOrientation[2]}`} onClick={() => router.push(`/product/${data.product_id}`)} >
                                    {data.value != null &&
                                        <Label className="absolute top-2 left-2 bg-[#e31612] p-2 text-white rounded">
                                            {new Intl.NumberFormat('en-PH', {
                                                style: 'currency',
                                                currency: 'PHP',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(data.value)}<span>OFF</span></Label>}
                                    <div className={`${productListDisplayOrientation[3]}`}>
                                        <div className={`${productListDisplayOrientation[6]} `}>
                                            <Image src={data.product_image} alt='' className='w-full h-full max-w-xs z-0' width={400} height={400} />
                                        </div>
                                        <div className='flex flex-col'>
                                            <label className='text-xs'>{data.product_name}</label>
                                            <div className='flex items-center gap-1'>
                                                {data.value != null && <Label className="text-[#e31612] text-sm md:text-md">
                                                    {new Intl.NumberFormat('en-PH', {
                                                        style: 'currency',
                                                        currency: 'PHP',
                                                    }).format(data.price - data.value)}
                                                </Label>}
                                                <Label className={`${data.value != null ? 'text-black/50 line-through text-[10px]' : 'text-black text-sm md:text-md'}  `}>
                                                    {new Intl.NumberFormat('en-PH', {
                                                        style: 'currency',
                                                        currency: 'PHP',
                                                    }).format(data.price)}
                                                </Label>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button disabled={toastState} onClick={() => {
                                            addToCart({
                                                id: data.id,
                                                email: user?.email,
                                                product_id: data.product_id,
                                                product_name: data.product_name,
                                                product_image: data.product_image,
                                                price: data.price,
                                                stocks: data.stocks,
                                                quantity: 1,
                                                value: data.value
                                            })
                                        }} className={`group-hover:bg-black/80 absolute ${isList ? 'top-2' : 'top-[85%]'}  right-2  bg-black text-white aspect-square p-2 text-[30px] flex items-center justify-center w-[40px] h-[40px] rounded-[50%]`}><TfiShoppingCart className='text-[15px] ' /></button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Add to Cart</p>
                                    </TooltipContent>
                                </Tooltip>


                            </div>

                        )) :
                            <div className='flex w-full h-full justify-center items-items'>
                                <Label>No Products Found</Label>
                            </div>
                    )

                    }

                </div>
                {loading && !noProductMessage && <div className='w-full flex justify-center items-center gap-2 pb-5'><ClipLoader
                    size={20}
                    color='black'
                    loading={true} />Loading...</div>}
                {noProductMessage && <div className='w-full flex justify-center items-center gap-2 pb-5'>No more products</div>}
            </div>


        </div >


    )

}

export default ProductList
