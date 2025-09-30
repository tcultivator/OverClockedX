"use client";
import React, { useState } from 'react'
import { ProductsType } from '@/types/ProductTypes';
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import CategoriesHeader from '@/components/Categories/CategoriesHeader';
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation';
type Props = {
    products: ProductsType[]
    category: string
}
const ProductList = ({ products, category }: Props) => {
    const router = useRouter();
    const [finalProducts, setFinalProducts] = useState(products)
    const searchParams = useSearchParams();
    const [loadingProducts, setLoadingProducts] = useState(false)
    useEffect(() => {
        const SortBy = searchParams.get('Sortby') || ''
        const Availability = searchParams.get('availability') || ''
        const low = searchParams.get('low') || ''
        const high = searchParams.get('high') || ''
        setLoadingProducts(true)
        console.log('gagana to kapag nag apply nako ng kahit anong filter')
        const getFilter = async () => {
            const res = await fetch('/api/filterProducts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category: category, SortBy: SortBy, Availability: Availability, low: low, high: high }),
            })
            const response = await res.json()
            setFinalProducts(response.result)
            console.log(response.result)
            setTimeout(() => {
                setLoadingProducts(false)
            }, 1000);

        }

        getFilter()

    }, [searchParams])

    return (
        <div className='flex flex-col bg-black rounded-[10px] max-h-[100vh] overflow-auto justify-start w-full font-thin'>
            <CategoriesHeader />

            <div id="right" className={`w-full  grid grid-cols-2 bg-black rounded-[10px] ${loadingProducts ? 'opacity-25' : 'opacity-100'}  p-5 overflow-y-auto gap-4 items-start sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`}>
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
                        <div key={index} className="flex flex-col h-full justify-between gap-3 cursor-pointer bg-white/10 p-4 rounded  " onClick={() => router.push(`/product/${data.product_id}`)} >
                            <div className="flex flex-col gap-3 cursor-pointer">
                                <div className='aspect-square w-full rounded bg-white/5'>
                                    <Image src={data.product_image} alt='' className='w-full h-full max-w-xs' width={400} height={400} />
                                </div>
                                <label className='text-xs'>{data.product_name}</label>
                                <label className="text-sm md:text-2xl">
                                    {new Intl.NumberFormat('en-PH', {
                                        style: 'currency',
                                        currency: 'PHP',
                                    }).format(data.price)}
                                </label>
                            </div>
                            <div className='w-full'>
                                <button className='w-full bg-white text-black py-2 px-3 rounded-[10px] mt-5 md:text-[12px] py-2 px-3 rounded-[5px]'>Add to cart</button>
                            </div>

                        </div>
                    ))
                )

                }
            </div>
        </div>


    )

}

export default ProductList
