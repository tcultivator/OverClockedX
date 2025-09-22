import React from 'react'

const CategoriesFilter = () => {
    return (
        <div id="left" className="w-[250px] hidden p-5 border-r border-gray-400 sticky top-40 h-[calc(100vh-10rem)] md:block lg:block xl:block">
            <div className="sticky top-0">
                <div className='py-6 border-b border-gray-400 flex flex-col gap-2'>
                    <h1 className='text-xl'>Availability</h1>
                    <div className='flex gap-1 items-center'>
                        <input type="checkbox" />
                        <label htmlFor="">In Stock</label>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <input type="checkbox" />
                        <label htmlFor="">Out of Stock</label>
                    </div>
                </div>
                <div className='py-6 border-b border-gray-400 flex flex-col gap-2'>
                    <h1 className='text-xl'>Price</h1>
                    <div className='flex box-border  gap-2 items-center relative'>
                        <div className='box-border flex items-center'>
                            <input className='w-full p-2 pl-5 border border-gray-400 rounded-[25px]' type="number" placeholder="0" />
                            <label className='absolute ml-3' htmlFor="">₱</label>
                        </div>
                        -
                        <div className='box-border flex items-center relative'>
                            <input className='w-full p-2 pl-5 border border-gray-400 rounded-[25px]' type="number" placeholder="100000" />
                            <label className='absolute ml-3' htmlFor="">₱</label>
                        </div>
                    </div>
                    {/* <div className="p-5">
                        <Range
                            step={STEP}
                            min={MIN}
                            max={MAX}
                            values={values}
                            onChange={(newValues) => setValues(newValues)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    className="h-2 bg-gray-300 rounded relative"
                                    style={{
                                        ...props.style,
                                        height: '2px'

                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props, index }) => (
                                <div
                                    {...props}
                                    className="w-5 h-5 bg-white rounded-full shadow"
                                    style={{ ...props.style }}
                                >
                                </div>
                            )}
                        />
                    </div> */}
                </div>
                
                <div>
                    <h1 className='text-xl'>Brands</h1>
                    <div className="flex flex-col justify-start items-start">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoriesFilter
