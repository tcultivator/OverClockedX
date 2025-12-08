"use client";
import React from 'react'
import { ProductsType } from '@/types/ProductTypes';
import Image from 'next/image'
import { redirect } from 'next/navigation';
import { Label } from '../ui/label';
interface Props {
    relatedProducts: ProductsType[];
}

const SuggestedProducts = ({ relatedProducts }: Props) => {
    return (
        <div className='p-[2px] md:p-2 text-white lg:w-[90%] xl:w-[80%] 2xl:w-[70%] mx-auto'>
            <h1 className='text-[17px] font-orbitron font-bold md:text-[25px] text-left w-max p-2 text-black rounded-t-md uppercase'>You may also like</h1>
            {
                relatedProducts.length > 0 ?
                    <div className=' grid grid-cols-3 gap-1 md:gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
                        {
                            relatedProducts.map((data, index) => (
                                <div key={index} className="flex flex-col gap-2 md:gap-3 text-black cursor-pointer p-1 md:p-4 h-full bg-white rounded relative md:pb-[23px]" onClick={() => redirect(`/product/${data.product_id}`)} >
                                    <Image
                                        src={data.product_image}
                                        alt=''
                                        className='w-full h-full max-w-xs'
                                        width={400}
                                        height={400}
                                    />
                                    <Label htmlFor="" className='font-thin text-[12px] md:text-base '>{data.product_name}</Label>
                                    <Label className="text-sm md:text-md" htmlFor="">₱{data.price}</Label>
                                </div>
                            ))
                        }

                    </div> :
                    <div className='flex w-full p-5 text-black/50 justify-center'>
                        <p>No Related Products</p>
                    </div>

            }

        </div>
    )
}

export default SuggestedProducts
