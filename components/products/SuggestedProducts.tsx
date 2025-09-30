"use client";
import React from 'react'
import { ProductsType } from '@/types/ProductTypes';
import Image from 'next/image'
import { redirect } from 'next/navigation';
interface Props {
    relatedProducts: ProductsType[];
}

const SuggestedProducts = ({ relatedProducts }: Props) => {
    return (
        <div className='p-2 text-white'>
            <h1 className='text-2xl font-anton text-[40px] text-left  w-max p-2 text-white rounded-t-md'>Related Prodcuts</h1>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
                {
                    relatedProducts.map((data, index) => (
                        <div key={index} className="flex flex-col gap-3 cursor-pointer bg-white/20 p-4 rounded" onClick={() => redirect(`/product/${data.product_id}`)} >
                            <Image
                                src={data.product_image}
                                alt=''
                                className='w-full h-full max-w-xs'
                                width={400}
                                height={400}
                            />
                            <label htmlFor="" className=''>{data.product_name}</label>
                            <label className="text-2xl" htmlFor="">₱{data.price}</label>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default SuggestedProducts
