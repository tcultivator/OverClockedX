"use client"
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import Image from "next/image";

import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";


const ShopByCategory = () => {
    const [current, setCurrent] = useState(0);
    const router = useRouter();
    const categoriesData = [
        { title: "LAPTOPS", image: "/bg/img5.png", navigation: "Laptop" },
        { title: "DESKTOPS", image: "/bg/img6.jpg", navigation: "Desktop" },
        { title: "PERIPHERALS", image: "/bg/img2.png", navigation: "Peripherals" },
        { title: "COMPONENTS", image: "/bg/img7.png", navigation: "Components" },
        


    ];

    function nextSlide() {
        setCurrent((prev) =>
            prev === categoriesData.length - 1 ? 0 : prev + 1
        );
    }

    useEffect(() => {
        const interval = setInterval(() => nextSlide(), 5000);
        return () => clearInterval(interval);
    }, []);

    function SelectCategories(category: string): void {
        router.push(`/categories/${category}`);
    }

    const prevSlide = () => {
        setCurrent((prev) =>
            prev === 0 ? categoriesData.length - 1 : prev - 1
        );
    }


    return (
        <div className="relative w-full h-[500px] flex justify-end overflow-hidden">


            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={categoriesData[current].image}
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                </motion.div>
            </AnimatePresence>


            <div className="relative z-10 p-5  w-full flex items-end justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current + "-text"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <Label className="text-[40px] font-orbitron text-white">
                            {categoriesData[current].title}
                        </Label>
                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-end sm:justify-between">

                            <div className="flex flex-col sm:flex-row items-center gap-2 mt-3 w-full">
                                <button
                                    onClick={() => SelectCategories(categoriesData[current].navigation)}

                                    className="w-full sm:w-[180px] rounded-[5px] p-4 text-[13px] transition-all duration-300 bg-white hover:bg-white/80"
                                >
                                    BROWSE {categoriesData[current].title}
                                </button>

                                <button
                                    onClick={() => SelectCategories('allProducts')}

                                    className="
                                            w-full sm:w-[180px] rounded-[5px] p-4 text-[13px]
                                            text-white bg-white/20 backdrop-blur-md 
                                            border border-white/30 transition-all duration-300
                                            hover:bg-white/30 hover:border-white/40 hover:text-white/80
                                            "
                                >
                                    BROWSE ALL
                                </button>
                            </div>

                            <div className="flex items-center gap-1">
                                <button onClick={prevSlide} className="aspect-square p-1  text-[20px] rounded border border-white text-white bg-white/20 backdrop-blur-md hover:bg-white/30 hover:border-white/40 hover:text-white/80"><IoMdArrowDropleft /></button>
                                <div className="flex items-center gap-[2px]">
                                    {categoriesData.map((data, index) => (
                                        <div key={index} className={`w-[20px] ${current == index ? 'bg-white' : 'bg-white/50 backdrop-blur-md'}  h-[2px]`}></div>
                                    ))}
                                </div>
                                <button onClick={nextSlide} className="aspect-square text-[20px] p-1 rounded border border-white text-white bg-white/20 backdrop-blur-md hover:bg-white/30 hover:border-white/40 hover:text-white/80"><IoMdArrowDropright /></button>
                            </div>
                        </div>


                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    );
};

export default ShopByCategory;
