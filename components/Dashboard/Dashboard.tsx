"use client";
import React from 'react'
import { LuCircleChevronLeft } from "react-icons/lu";
import { LuCircleChevronRight } from "react-icons/lu";
import { useEffect, useState } from 'react';

const Dashboard = () => {

    const [current, setCurrent] = useState(0);
    const images: string[] = [
        "/slider/s1.png",
        "/slider/s2.jpg",
        "/slider/s3.webp",
        "/slider/s4.jpg"
    ];

    function prevSlide() {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    };
    function nextSlide() {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    };

    function selectSlide(index: number) {
        setCurrent(index)
    }
   useEffect(() => {
    const interval = setInterval(() => {
        nextSlide();
    }, 10000);

    return () => clearInterval(interval); 
}, []);
    return (
        <div className="flex flex-col gap-10">
            <div className="relative bg-gray-400  ">
                <div className="flex relative w-full transition-transform duration-800 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                    {images.map((src, idx) => (
                        <img key={idx} src={src} className="w-full flex-shrink-0" />
                    ))}
                </div>
                <div className="w-full flex justify-between p-3 text-4xl absolute top-[50%] transform -translate-y-1/2 text-white">
                    <button onClick={prevSlide}><LuCircleChevronLeft /></button>
                    <button onClick={nextSlide}><LuCircleChevronRight /></button>
                </div>
                <div className=" w-full flex gap-4 items-center justify-center absolute bottom-0 py-3 bg-black/10">
                    {images.map((src, index) => (
                        current == index ? (
                            <button key={index} className="border-2 border-white bg-white rounded-[50%] p-1" ></button>
                        ) : (
                            <button onClick={() => selectSlide(index)} key={index} className="border-2 border-white  rounded-[50%] p-1" ></button>
                        )
                    ))}
                </div>
            </div>
        </div >
    )
}

export default Dashboard
