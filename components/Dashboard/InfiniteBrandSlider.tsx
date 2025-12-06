"use client";
import React, { useRef, useEffect, useState } from "react";

export const brandLogos = [
    '/techLogos/acer-dark.png',
    '/techLogos/amd.png',
    '/techLogos/apple-dark.png',
    '/techLogos/asus-dark.png',
    '/techLogos/dell-dark.png',
    '/techLogos/hp-dark.png',
    '/techLogos/intel-dark.png',
    '/techLogos/lenovo-dark.png',
    '/techLogos/msibusiness-dark.png',
    '/techLogos/nvidia.png',
    '/techLogos/razer-dark.png',
    '/techLogos/samsung-dark.png',
    '/techLogos/acer-dark.png',
    '/techLogos/amd.png',
    '/techLogos/apple-dark.png',
    '/techLogos/asus-dark.png',
    '/techLogos/dell-dark.png',
    '/techLogos/hp-dark.png',
    '/techLogos/intel-dark.png',
    '/techLogos/lenovo-dark.png',
    '/techLogos/msibusiness-dark.png',
    '/techLogos/nvidia.png',
    '/techLogos/razer-dark.png',
    '/techLogos/samsung-dark.png',
];

const InfiniteBrandSlider = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {

            setWidth(containerRef.current.scrollWidth / 2);
        }
    }, []);

    return (
        <>
            <style>
                {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${width}px); }
          }
        `}
            </style>

            <div className="relative w-full overflow-hidden  py-4">
                <div
                    ref={containerRef}
                    className="flex whitespace-nowrap items-center"
                    style={{
                        animation: width ? `scroll 20s linear infinite` : undefined,
                    }}
                >
                    {[...brandLogos, ...brandLogos].map((logo, idx) => (
                        <div
                            key={idx}
                            style={{ flexShrink: 0, marginRight: '2rem' }}
                        >
                            <img
                                src={logo}
                                alt={`brand-logo-${idx}`}
                                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
                                loading="lazy"
                                style={{ display: 'block' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Left & Right gradient fade */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent" />
            </div>
        </>
    );
};

export default InfiniteBrandSlider;
