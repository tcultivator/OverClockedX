"use client";
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { BsFillXCircleFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { Slider } from "@/components/ui/slider"
import { Button } from '../ui/button';
import { useFilterStore } from '@/stores/filterStore';
import { RiCloseLargeFill } from "react-icons/ri";
import { brands } from '@/utils/datasetAddress/brands'
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
const CategoriesFilter = () => {
    const searchParams = useSearchParams();

    const handleFilterChange = (filterName: string, value: string) => {

        if (value == 'In Stock' || value == 'Out of Stock') {
            
            setAvailabilityState(value);
            setAvailabilityFilterState(true);
        }
        if (value == 'bestselling' || value == 'ASC' || value == 'DESC') {
            setSortbyFilterState(true)
        }
        const params = new URLSearchParams(searchParams.toString());
        params.delete('search');
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
        params.delete('search');
        params.set('low', value[0].toString() || '0');
        params.set('high', value[1].toString() || '100000')
        window.history.pushState({}, '', `?${params.toString()}`);
        setFilterDisplay(false)
    }




    const [availabilityState, setAvailabilityState] = useState('')
    const clearFilterAvailability = () => {
        
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
        params.delete('search');
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

    useEffect(() => {
        const search = searchParams.get('search') || ''
    
        if (search != '') {
           
            //clear brands filter state
            setSelectedBrands([])

            //clear price range filter state
            setPriceRangeFilterState(false)
            setValue([0, 100000])

            //clear sort by filter state
            setSortbyFilterState(false)

            // clear availability state
            setAvailabilityState('')
            setAvailabilityFilterState(false)
        }


    }, [searchParams])
    return (
        <div
            id="left"
            className={`${displayFilter ? 'block absolute top-0 left-0 z-50' : 'hidden'
                } h-screen bg-white w-full md:relative md:block lg:block xl:block font-thin md:w-[300px] 2xl:w-[350px] md:border-r md:border-r-black/20 z-40 p-5 box-border`}
        >
            
            <div className="flex flex-col h-full min-h-0">
                
                <div className="w-full flex justify-end mb-2 md:hidden">
                    <button onClick={() => setFilterDisplay(false)}>
                        <RiCloseLargeFill className="text-black" />
                    </button>
                </div>

                
                <div className="flex flex-col flex-1 min-h-0 overflow-y-auto gap-3">
                    {/* Availability */}
                    <div className="flex flex-col gap-2 text-black border-b border-black/20 pb-3">
                        <Label className="text-lg font-orbitron uppercase">Availability</Label>
                        <div className="flex gap-1 items-center">
                            <input
                                id="In Stock"
                                type="radio"
                                name="availability"
                                value="In Stock"
                                checked={availabilityState === 'In Stock'}
                                onChange={(e) => handleFilterChange('availability', e.target.value)}
                            />
                            <Label htmlFor="In Stock" className="cursor-pointer font-normal">
                                In Stock
                            </Label>
                        </div>
                        <div className="flex gap-1 items-center">
                            <input
                                id="Out of Stock"
                                type="radio"
                                name="availability"
                                value="Out of Stock"
                                checked={availabilityState === 'Out of Stock'}
                                onChange={(e) => handleFilterChange('availability', e.target.value)}
                            />
                            <Label htmlFor="Out of Stock" className="cursor-pointer font-normal">
                                Out of Stock
                            </Label>
                        </div>
                        {availabilityFilterState && (
                            <button
                                className="flex items-center gap-2 text-red-400"
                                onClick={clearFilterAvailability}
                            >
                                <BsFillXCircleFill /> Clear filter
                            </button>
                        )}
                    </div>

                    {/* Sort By */}
                    <div className="flex flex-col gap-2 text-black border-b border-black/20 pb-3">
                        <Label className="text-lg font-orbitron uppercase">Sort By</Label>
                        <Select onValueChange={(value) => handleFilterChange('Sortby', value)}>
                            <SelectTrigger>
                                <SelectValue className="text-black" placeholder="Select Sort by" />
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
                        {sortbyFilterState && (
                            <button
                                className="flex items-center gap-2 text-red-400"
                                onClick={clearFilterSortby}
                            >
                                <BsFillXCircleFill /> Clear filter
                            </button>
                        )}
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-4 text-black border-b border-black/20 pb-3">
                        <Label className="text-lg font-orbitron uppercase">Price</Label>
                        <div className="flex gap-2 items-center relative">
                            <div className="flex items-center relative w-full">
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full p-2 pl-5 border border-black/30 rounded-[25px]"
                                    value={value[0]}
                                    onChange={(e) => setValue([Number(e.target.value), value[1]])}
                                />
                                <label className="absolute ml-3">₱</label>
                            </div>
                            -
                            <div className="flex items-center relative w-full">
                                <input
                                    type="number"
                                    placeholder="100000"
                                    className="w-full p-2 pl-5 border border-black/30 rounded-[25px]"
                                    value={value[1]}
                                    onChange={(e) => setValue([value[0], Number(e.target.value)])}
                                />
                                <label className="absolute ml-3">₱</label>
                            </div>
                        </div>
                        <Slider
                            value={value}
                            onValueChange={setValue}
                            min={0}
                            max={100000}
                            step={10}
                            className="mt-2 w-full"
                        />
                        <Button
                            onClick={handleInputFilter}
                            className="w-full flex items-center justify-center gap-1"
                            variant="default"
                        >
                            <FaCheckCircle /> Apply
                        </Button>
                        {priceRangeFilterState && (
                            <button className="flex items-center gap-2 text-red-400" onClick={clearFilterPriceRange}>
                                <BsFillXCircleFill /> Clear filter
                            </button>
                        )}
                    </div>

                    {/* Brands */}
                    <div className="flex flex-col flex-1 min-h-0 gap-2 text-black p-2">
                        <Label className="text-lg font-orbitron uppercase">Brands</Label>

                        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2">
                            {brands.map((data, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(data)}
                                        onChange={(e) =>
                                            setSelectedBrands((prev) =>
                                                e.target.checked ? [...prev, data] : prev.filter((item) => item !== data)
                                            )
                                        }
                                    />
                                    <Label className="font-normal">{data}</Label>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-2 items-center">
                                {selectedBrands.length > 0 && (
                                    <button onClick={clearBrandFilter} className="text-blue-400 underline text-[13px]">
                                        clear
                                    </button>
                                )}
                                <span>{selectedBrands.length} <span>Selected</span></span>
                            </div>
                            <Button onClick={handleBrandFilter} className="flex items-center justify-center gap-1">
                                <FaCheckCircle /> Apply
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}


export default CategoriesFilter
