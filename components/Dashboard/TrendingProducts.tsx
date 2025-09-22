import React from 'react';

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
                <h2 className="text-2xl font-Abyssinica font-thin text-left  w-max p-2 text-white rounded-t-md">Trending Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left side */}
                <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-1 gap-4">
                    <img
                        src={images[0]}
                        alt="Trending Product 1"
                        className="w-full h-full object-cover rounded-md"
                    />
                    {/* On medium screens, show second image on left */}
                    <img
                        src={images[1]}
                        alt="Trending Product 2"
                        className="w-full h-full object-cover rounded-md md:block lg:hidden"
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
                        <img
                            key={idx}
                            src={img}
                            alt={`Trending Product ${idx + 3}`}
                            className="w-full h-full object-cover rounded-md"
                        />
                    ))}

                    {/* Only show images[1] on large, since it was already shown on md */}
                    <img
                        src={images[1]}
                        alt="Trending Product 2"
                        className="w-full h-full object-cover rounded-md hidden lg:block"
                    />
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;
