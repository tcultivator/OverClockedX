"use client";
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BsFillXCircleFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";

import { Button } from '../ui/button';
const CategoriesFilter = () => {
    const searchParams = useSearchParams();

    const handleFilterChange = (filterName: string, value: string) => {
        if (value == 'In Stock' || value == 'Out of Stock') {
            console.log('gagana lang dapat to kapag ung availability ung ififilter ko')
            setAvailabilityState(value);
            setAvailabilityFilterState(true);
        }
        if (value == 'bestselling' || value == 'ASC' || value == 'DESC') {
            setSortbyFilterState(true)
        }
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(filterName, value);
        } else {
            params.delete(filterName);
        }
        window.history.pushState({}, '', `?${params.toString()}`);

    };


    // for input filter
    const [lowValue, setLowValue] = useState('0')
    const [highValue, setHightValue] = useState('100000')

    const handleInputFilter = () => {
        console.log(lowValue)
        console.log(highValue)
        setPriceRangeFilterState(true)
        const params = new URLSearchParams(searchParams.toString());
        params.set('low', lowValue || '0');
        params.set('high', highValue || '100000')
        window.history.pushState({}, '', `?${params.toString()}`);

    }




    const [availabilityState, setAvailabilityState] = useState('')
    const clearFilterAvailability = () => {
        console.log('eto ung pang clear ng filter')
        const params = new URLSearchParams(searchParams.toString());
        params.delete('availability')
        setAvailabilityState('')
        setAvailabilityFilterState(false)
        window.history.pushState({}, '', `?${params.toString()}`);
    }



    //filter state
    const [availabilityFilterState, setAvailabilityFilterState] = useState(false)
    const [sortbyFilterState, setSortbyFilterState] = useState(false)


    const clearFilterSortby = () => {
        console.log('eto ung pang clear ng filter')
        const params = new URLSearchParams(searchParams.toString());
        params.delete('Sortby');
        setSortbyFilterState(false)
        window.history.pushState({}, '', `?${params.toString()}`);
    }


    const [priceRangeFilterState, setPriceRangeFilterState] = useState(false)


    const clearFilterPriceRange = () => {
        setPriceRangeFilterState(false)
        setLowValue('')
        setHightValue('')
        const params = new URLSearchParams(searchParams.toString());
        params.delete('low');
        params.delete('high');
        window.history.pushState({}, '', `?${params.toString()}`);
    }




    return (
        <div id="left" className="w-[350px] bg-black rounded-[10px] hidden p-5 sticky top-10 h-screen md:block lg:block xl:block font-thin">
            <div className="sticky top-0">
                <div className='py-6 border-b border-gray-400 flex flex-col gap-2'>
                    <h1 className='text-xl'>Availability</h1>

                    <div className='flex gap-1 items-center'>
                        <input
                            id='In Stock'
                            type="radio"
                            name="availability"
                            value="In Stock"
                            checked={availabilityState === "In Stock"}
                            onChange={(e) => handleFilterChange("availability", e.target.value)}
                        />
                        <label htmlFor='In Stock' className='cursor-pointer'>In Stock</label>
                    </div>

                    <div className='flex gap-1 items-center'>
                        <input
                            id='Out of Stock'
                            type="radio"
                            name="availability"
                            value="Out of Stock"
                            checked={availabilityState === "Out of Stock"}
                            onChange={(e) => handleFilterChange("availability", e.target.value)}
                        />
                        <label htmlFor="Out of Stock" className='cursor-pointer'>Out of Stock</label>
                    </div>
                    {availabilityFilterState &&
                        <div>
                            <button className='flex items-center justify-center gap-2' onClick={() => clearFilterAvailability()}><BsFillXCircleFill className='text-red-400' /> Clear filter</button>
                        </div>
                    }

                </div>
                <div className='py-6 border-b border-gray-400 flex flex-col gap-2'>
                    <label className="text-white text-xl">Sort by</label>
                    <select defaultValue={""} onChange={(e) => handleFilterChange("Sortby", e.target.value)} name="" id="sort-by">
                        <option value="" disabled>Select</option>
                        <option value="bestselling">Best Selling</option>
                        <option value="ASC">Low to High</option>
                        <option value="DESC">High to Low</option>
                    </select>
                    {sortbyFilterState &&
                        <div>
                            <button className='flex items-center justify-center gap-2' onClick={() => clearFilterSortby()}><BsFillXCircleFill className='text-red-400' /> Clear filter</button>
                        </div>
                    }
                </div>
                <div className='py-6 border-b border-gray-400 flex flex-col gap-4'>
                    <h1 className='text-xl '>Price</h1>
                    <div className='flex box-border  gap-2 items-center relative'>
                        <div className='box-border flex items-center'>
                            <input className='w-full p-2 pl-5 border border-gray-400 rounded-[25px]' type="number" placeholder="0"
                                value={lowValue}
                                onChange={(e) => {
                                    setLowValue(e.target.value)

                                }} />
                            <label className='absolute ml-3' htmlFor="">₱</label>
                        </div>
                        -
                        <div className='box-border flex items-center relative'>
                            <input className='w-full p-2 pl-5 border border-gray-400 rounded-[25px]' type="number" placeholder="100000"
                                value={highValue}
                                onChange={(e) => {
                                    setHightValue(e.target.value)

                                }} />
                            <label className='absolute ml-3' htmlFor="">₱</label>
                        </div>

                    </div>
                    <div >
                        <Button onClick={() => handleInputFilter()} className='w-full flex items-center justify-center gap-3' variant={'secondary'}><FaCheckCircle />Apply</Button>
                    </div>
                    {
                        priceRangeFilterState &&
                        <div>
                            <button className='flex items-center justify-center gap-2' onClick={() => clearFilterPriceRange()}><BsFillXCircleFill className='text-red-400' /> Clear filter</button>
                        </div>
                    }
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
