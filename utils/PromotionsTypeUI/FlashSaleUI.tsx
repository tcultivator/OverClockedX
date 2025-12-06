"use client"
import React from 'react'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaFacebook } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { promotion_products } from '@/types/promotion_products_types';
import { useRouter } from 'next/navigation';
const buildURL = process.env.NEXT_PUBLIC_BASE_URL;
type props = {
    promotionProducts: promotion_products
}
const FlashSaleUI = ({ promotionProducts }: props) => {
    const router = useRouter();
    return (
        <div
            style={{
                backgroundImage: `url("${promotionProducts.product_image}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            id="discountedProducts"
            className="@container rounded-md @sm:p-4 @md:p-6 flex flex-col justify-between  h-full  text-black relative bg-white shadow-sm border border-black/15 aspect-square"
        >
            {/* Header */}
            <div className="flex justify-between items-center bg-primary rounded-t-md px-3 py-1 text-white">
                <Label className="font-orbitron text-[12px] @sm:text-[15px]">
                    OverClockedX
                </Label>

                <div className="flex justify-center gap-1">
                    <Label className="font-orbitron break-all text-[9px] @lg:text-[10px] @xl:text-[11px] @2xl:text-[13px] text-center">
                        FOLLOW US
                    </Label>

                    <div className="flex gap-2 items-center justify-center">
                        <Link href={"https://www.facebook.com/"} type="_blank">
                            <FaFacebook className="text-[14px] @lg:text-[16px] @xl:text-[18px] @2xl:text-[20px]" />
                        </Link>

                        <Link href={"https://www.instagram.com/"} type="_blank">
                            <IoLogoInstagram className="rounded-full bg-white text-black p-[2px] text-[14px] @lg:text-[16px] @xl:text-[18px] @2xl:text-[20px]" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Month + Promotion Type */}
            <div className="w-full flex flex-col h-full justify-between">
                <div className="w-max flex flex-col h-max  items-center text-center relative bg-white/50 mx-auto">
                    <Label className="font-orbitron text-[13px] @sm:text-[15px]">
                        {new Date(promotionProducts.start_date).toLocaleString("en-US", {
                            month: "long",
                        })}
                    </Label>

                    <div className="flex items-center z-30 ">
                        <div className="flex flex-col ">
                            <Label className="font-anton text-[35px] @md:text-[35px] @lg:text-[35px] @xl:text-[45px] @2xl:text-[50px] leading-none">
                                FLASH
                            </Label>

                            <Label className="font-orbitron text-[10px] text-white @sm:text-[10px] @2xl:text-[15px] leading-none bg-[#FFD477] @xl:px-1 xl:py-[4px]  @2xl:px-2 @2xl:py-[6px] text-center flex justify-center items-center">
                                ₱{promotionProducts.value}
                                <span>OFF</span>
                            </Label>
                        </div>

                        <Label className="font-anton text-[60px] @lg:text-[60px] @xl:text-[75px] @2xl:text-[90px] leading-none text-[#FFD477] ">
                            SALE
                        </Label>
                    </div>
                </div>
                <div className="w-[90%] @sm:w-[75%] @lg:w-[75%] mx-auto   relative ">

                    <div className=" w-full flex flex-col justify-center items-center bg-white/50">
                        <Label className="font-orbitron text-[10px] @xl:text-[13px] @2xl:text-[15px] text-center overflow-hidden line-clamp-1">
                            {promotionProducts.product_name}
                        </Label>

                        <Label className="font-anton text-[25px] @lg:text-[35px] @xl:text-[45px] @2xl:text-[55px] leading-none">
                            {new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                            }).format(promotionProducts.price)}
                        </Label>
                    </div>
                </div>
            </div>



            {/* Footer */}
            <div className="flex  px-3 py-1  items-center justify-between gap-3  bg-primary rounded-b-md text-white">
                <div className="flex flex-col justify-center items-center">
                    <Label className="font-orbitron text-[8px] @lg:text-[9px] @xl:text-[10px] @2xl:text-[12px]">
                        Visit Our Website
                    </Label>

                    <Link href={`${buildURL}`}>
                        <Label className="font-orbitron break-all text-[9px] @lg:text-[10px] @xl:text-[11px] @2xl:text-[13px] text-center">
                            {buildURL}
                        </Label>
                    </Link>
                </div>

                <button
                    onClick={() =>
                        router.push(`/product/${promotionProducts.product_id}`)
                    }

                    className="px-4  @sm:px-5 text-[9px] @lg:text-[10px] @xl:text-[11px] @2xl:text-[12px] bg-white rounded text-black py-1"
                >
                    Order Now
                </button>
            </div>
        </div>

    )
}

export default FlashSaleUI
