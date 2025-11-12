"use client";
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BsFillXCircleFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { Slider } from "@/components/ui/slider"
import { Button } from '../ui/button';
import { useFilterStore } from '@/stores/filterStore';
import { RiCloseLargeFill } from "react-icons/ri";
import { brands } from '@/utils/datasetAddress/brands'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
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
        setFilterDisplay(false)
    };

    const [selectedBrands, setSelectedBrands] = useState<string[]>([])

    const handleInputFilter = () => {
        setPriceRangeFilterState(true)
        const params = new URLSearchParams(searchParams.toString());
        params.set('low', value[0].toString() || '0');
        params.set('high', value[1].toString() || '100000')
        window.history.pushState({}, '', `?${params.toString()}`);
        setFilterDisplay(false)
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
        setValue([0, 100000])
        const params = new URLSearchParams(searchParams.toString());
        params.delete('low');
        params.delete('high');
        window.history.pushState({}, '', `?${params.toString()}`);
    }

    // for input filter
    const [value, setValue] = useState([0, 100000])
    const displayFilter = useFilterStore((state) => state.displayFilter)
    const setFilterDisplay = useFilterStore((state) => state.setFilterDisplay)



    const handleBrandFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('brands', selectedBrands.toString());
        window.history.pushState({}, '', `?${params.toString()}`);
        setFilterDisplay(false)
    }

    const clearBrandFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('brands');
        setSelectedBrands([])
        window.history.pushState({}, '', `?${params.toString()}`);
    }
    return (
        <div className='bg-black'>
            <div id="left" className={`w-full bg-black  ${displayFilter == false ? 'hidden' : 'block'} h-screen w-full box-border left-0 p-5  absolute top-0 md:relative  md:block lg:block xl:block font-thin md:w-[350px] md:inset-shadow-sm md:inset-shadow-white/50 z-50 md:rounded-[10px] md:p-5 md:z-10`}>
                <div className="sticky top-0">
                    <div className='w-full flex justify-end'>
                        <button className='block md:hidden ' onClick={() => {
                            console.log(displayFilter)
                            setFilterDisplay(false)
                        }}><RiCloseLargeFill /></button>
                    </div>

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
                        <Select onValueChange={(value) => handleFilterChange("Sortby", value)}>
                            <SelectTrigger>
                                <SelectValue className='text-white' placeholder="Select Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Sort by</SelectLabel>
                                    <SelectItem value="bestselling">Best Selling</SelectItem>
                                    <SelectItem value="ASC">Low to High</SelectItem>
                                    <SelectItem value="DESC">High to Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                                    value={value[0]}
                                    onChange={(e) => {
                                        const newValue = Number(e.target.value);
                                        setValue([newValue, value[1]]);
                                    }}
                                />
                                <label className='absolute ml-3' htmlFor="">₱</label>
                            </div>
                            -
                            <div className='box-border flex items-center relative'>
                                <input className='w-full p-2 pl-5 border border-gray-400 rounded-[25px]' type="number" placeholder="100000"
                                    value={value[1]}
                                    onChange={(e) => {
                                        const newValue = Number(e.target.value);
                                        setValue([value[0], newValue]);
                                    }}
                                />
                                <label className='absolute ml-3' htmlFor="">₱</label>
                            </div>

                        </div>
                        <Slider
                            value={value}
                            onValueChange={setValue}
                            max={100000}
                            min={0}
                            step={10}
                            className="mt-2 w-full"
                            aria-label="Price Range"
                        />
                        <div >
                            <Button onClick={() => handleInputFilter()} className='w-full flex items-center justify-center gap-3' variant={'secondary'}><FaCheckCircle />Apply</Button>
                        </div>
                        {
                            priceRangeFilterState &&
                            <div>
                                <button className='flex items-center justify-center gap-2' onClick={() => clearFilterPriceRange()}><BsFillXCircleFill className='text-red-400' /> Clear filter</button>
                            </div>
                        }
                    </div>

                    <div className='flex flex-col gap-2 bg-black'>
                        <h1 className='text-xl'>Brands</h1>
                        <div className='max-h-[100px] md:max-h-[250px] overflow-auto flex flex-col gap-2 '>
                            <div className="flex flex-col gap-2 justify-start items-start">
                                {brands.map((data, index) => (
                                    <div key={index} className='flex gap-2 items-center justify-start'>
                                        <input type="checkbox" checked={selectedBrands.some(item => item === data)} onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedBrands(prev => [...prev, data])
                                                console.log(selectedBrands)
                                            }
                                            else {
                                                setSelectedBrands(prev => prev.filter(item => item != data))
                                                console.log(selectedBrands)
                                            }

                                        }} />
                                        <label htmlFor="">{data}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-2 items-center'>
                                {selectedBrands.length > 0 && <button onClick={() => {
                                    clearBrandFilter()
                                }} className='text-blue-400 underline text-[13px]'>clear</button>}
                                <label className='flex gap-2 items-center' htmlFor="">{selectedBrands.length}<span>Selected</span></label>
                            </div>

                            <Button onClick={() => handleBrandFilter()} className='flex items-center justify-center gap-3' variant={'secondary'}><FaCheckCircle />Apply</Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}


export default CategoriesFilter
