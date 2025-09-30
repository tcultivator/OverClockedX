import React from 'react';
import Image from 'next/image';
const TrendingProducts = () => {
    const images: string[] = [
        "/promotions/pm1.jpg",
        "/promotions/pm2.jpg",
        "/promotions/pm3.jpg",
        "/promotions/pm4.jpg",
        "/promotions/pm5.jpg",
    ];

    return (
        <section className="p-4 m-auto px-[5%]">
            <div className="w-full">
                <h2 className="text-2xl font-anton text-[40px] text-left  w-max p-2 text-white rounded-t-md">Promotions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left side */}
                <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-1 gap-4">
                    <Image
                        src={images[0]}
                        alt="Trending Product 1"
                        className="w-full h-full object-cover rounded-md"
                        width={1000}
                        height={1000}
                    />
                    {/* On medium screens, show second image on left */}
                    <Image
                    src={images[1]}
                    alt="Trending Product 2"
                    className="w-full h-full object-cover rounded-md md:block lg:hidden"
                    width={800}
                    height={800}
                    />
                </div>

                {/* Right side */}
                <div className="
                    grid 
                    grid-cols-1 
                    md:grid-cols-1 
                    md:grid-rows-3 
                    lg:grid-cols-2 
                    lg:grid-rows-2 
                    gap-4
                ">
                    {/* On medium: show images[2,3,4]; On large: images[1,2,3,4] */}
                    {images.slice(2, 5).map((img, idx) => (
                        <Image
                            key={idx}
                            src={img}
                            alt={`Trending Product ${idx + 3}`}
                            className="w-full h-full object-cover rounded-md"
                            width={800}
                            height={800}
                        />
                    ))}

                    {/* Only show images[1] on large, since it was already shown on md */}
                    <Image
                        src={images[1]}
                        alt="Trending Product 2"
                        className="w-full h-full object-cover rounded-md hidden lg:block"
                        width={800}
                        height={800}
                    />
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;
