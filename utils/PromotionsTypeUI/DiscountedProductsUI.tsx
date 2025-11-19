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
type props = {
    promotionProducts: promotion_products
}
const DiscountedProductsUI = ({ promotionProducts }: props) => {
    const router = useRouter();
    return (


        <div
            style={{
                backgroundImage: `url("/discountedProductsbg.jpg")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            id="discountedProducts"
            className="@container rounded-md p-3 @sm:p-4 @md:p-6 flex flex-col h-full justify-between  text-white relative"
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <Label className="font-orbitron text-[12px] @sm:text-[15px]">
                    OverClockedX
                </Label>

                <div className="flex flex-col justify-center gap-1">
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
            <div className="w-full flex justify-center mt-3 @sm:mt-5">
                <div className="w-full flex flex-col justify-center items-center text-center relative">
                    <Label className="font-orbitron text-[13px] @sm:text-[15px]">
                        {new Date(promotionProducts.start_date).toLocaleString("en-US", {
                            month: "long",
                        })}
                    </Label>

                    <div className="flex items-center z-30">
                        <div className="flex flex-col">
                            <Label className="font-anton text-[35px] @md:text-[35px] @lg:text-[35px] @xl:text-[45px] @2xl:text-[50px] leading-none">
                                PRODUCT
                            </Label>

                            <Label className="font-orbitron text-[10px] @sm:text-[10px] @2xl:text-[15px] leading-none bg-[#FF7777] @xl:px-1 xl:py-[4px]  @2xl:px-2 @2xl:py-[6px] text-center flex justify-center items-center">
                                ₱{promotionProducts.value}
                                <span>OFF</span>
                            </Label>
                        </div>

                        <Label className="font-anton text-[60px] @lg:text-[60px] @xl:text-[75px] @2xl:text-[90px] leading-none text-[#FF7777]">
                            DISCOUNT
                        </Label>
                    </div>
                </div>
            </div>

            {/* Product Image */}
            <div className="w-[90%] @sm:w-[75%] mx-auto mt-[-15%]  relative">
                <Image
                    src={promotionProducts.product_image}
                    alt="Trending Product 2"
                    className="w-full h-full rounded-md aspect-square"
                    width={800}
                    height={800}
                />

                <div className="absolute w-full flex flex-col justify-center items-center mt-[-10%] @sm:mt-[-15%]">
                    <Label className="font-orbitron text-[12px] @xl:text-[13px] @2xl:text-[15px] text-center">
                        {promotionProducts.product_name}
                    </Label>

                    <Label className="font-anton text-[35px] @lg:text-[35px] @xl:text-[45px] @2xl:text-[55px] leading-none">
                        {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                        }).format(promotionProducts.price)}
                    </Label>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col @sm:flex-row items-center justify-between gap-3 mt-8 @sm:mt-4">
                <div className="flex flex-col justify-center items-center">
                    <Label className="font-orbitron text-[8px] @lg:text-[9px] @xl:text-[10px] @2xl:text-[12px]">
                        Visit Our Website
                    </Label>

                    <Link href={"https://overclockedx.onrender.com"}>
                        <Label className="font-orbitron break-all text-[9px] @lg:text-[10px] @xl:text-[11px] @2xl:text-[13px] text-center">
                            https://overclockedx.onrender.com
                        </Label>
                    </Link>
                </div>

                <Button
                    onClick={() =>
                        router.push(`/product/${promotionProducts.product_id}`)
                    }
                    variant={"secondary"}
                    className="px-4 py-2 @sm:px-5"
                >
                    Order Now
                </Button>
            </div>
        </div>


    )

}

export default DiscountedProductsUI
