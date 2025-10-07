"use client";
import React from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
const ShopByCategory = () => {
    const router = useRouter();
    const categoryImage: { src: string; title: string }[] = [
        {
            src: '/category/Desktop.png',
            title: 'Desktop'
        },
        {
            src: '/category/Laptop.png',
            title: 'Laptop'
        },
        {
            src: '/category/PC-Components.png',
            title: 'Components'
        },
        {
            src: '/category/Peripherals.png',
            title: 'Peripherals'
        },
        {
            src: '/category/Storage.png',
            title: 'Storage'
        },
        {
            src: '/category/Webcam.png',
            title: 'WebCam'
        }

    ]

    function SelectCategories(category: string): void {
        router.push(`/categories/${category}`);
    }
    return (
        <div className=" flex flex-col gap-5 items-center justify-center py-2 px-[5%]">
            <div className="w-full">
                <h2 className="text-2xl font-anton text-[40px] text-left  w-max p-2 text-white rounded-t-md">Shop by Category</h2>
            </div>
            <div className=" grid grid-cols-2 justify-center gap-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6">
                {categoryImage.map((src, index) => (
                    <div key={index} className="relative flex justify-center bg-black inset-shadow-sm inset-shadow-white/50 rounded-[20px]">
                        <Image
                            src={src.src}
                            alt=""
                            id='custom-image'
                            className="cursor-pointer "
                            key={index}
                            onClick={() => SelectCategories(src.title)}
                            width={1000}
                            height={1000}
                        />
                        <label onClick={() => SelectCategories(src.title)} className="absolute rounded-[20px] font-anton text-lg flex items-center justify-center text-center bg-black/30 w-full h-[15%] text-white p-1  cursor-pointer transition-all duration-200 ease-in-out" id='custom-label'>{src.title}</label>
                    </div>


                ))}
            </div>

        </div>
    )
}

export default ShopByCategory
