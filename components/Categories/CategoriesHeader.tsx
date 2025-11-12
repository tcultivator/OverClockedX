import React, { useState } from 'react'
import { IoGridOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { useFilterStore } from '@/stores/filterStore';
import { useCategoriesHeaderStore } from '@/stores/categoriesHeaderStore';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CiSearch } from "react-icons/ci";
import Image from 'next/image';
import { Label } from '../ui/label';
import { ProductsType } from '@/types/ProductTypes';
import { useRouter } from 'next/navigation';
import { IoFilterOutline } from "react-icons/io5";

const CategoriesHeader = () => {
    const setFilterDisplay = useFilterStore((state) => state.setFilterDisplay)
    const router = useRouter();
    const setListDisplay = useCategoriesHeaderStore((state) => state.setListDisplay)
    const setGridDisplay = useCategoriesHeaderStore((state) => state.setGridDisplay)
    const isList = useCategoriesHeaderStore((state) => state.isList)
    const [searchValu, setSearchVal] = useState('')
    const [searchResults, setSearchResults] = useState<ProductsType[]>([])
    let isTimeoutActive: ReturnType<typeof setTimeout> | null = null;
    const searchProducts = (value: string) => {
        if (isTimeoutActive != null) {
            clearTimeout(isTimeoutActive)
        }
        isTimeoutActive = setTimeout(() => {

            setSearchVal(value)
            if (value != '') {
                searchFunction(value)
            } else {
                setSearchResults([])
            }
        }, 1500)

    }

    const searchFunction = async (value: string) => {
        console.log('eto ung search payload,', value)
        const searchproduct = await fetch('/api/searchProducts', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ searchValue: value })
        })
        const result = await searchproduct.json()
        if (result.status !== 500) {
            console.log('eto ung result ng search! ', result)
            setSearchResults(result)
        } else {
            console.log('something went wrong')
        }
    }
    return (
        <div className="flex justify-between sticky gap-1 items-center top-0 z-30  p-2 md:px-5 w-full font-Abyssinica font-thin h-max border-b border-white/20 md:justify-end">
            <button className='block md:hidden bg-white text-black text-[14px] rounded p-1' onClick={() => setFilterDisplay(true)}><IoFilterOutline /></button>
            <div className='flex items-center gap-5'>
                <div className='relative'>
                    <div className='flex gap-2 items-center'>
                        <Input className='md:w-[350px]' type='text' placeholder='Search here...' onChange={(e) => searchProducts(e.target.value)} />
                        <Button onClick={() => searchFunction(searchValu)} variant={'secondary'}><CiSearch /></Button>
                    </div>
                    <div className={` bg-white  max-h-[50vh] overflow-auto mt-1 rounded w-full absolute flex flex-col gap-2 ${searchResults.length != 0 && 'p-1'}`}>
                        {searchResults.map((data, index) => (
                            <div key={index} onClick={() => router.push(`/product/${data.product_id}`)} className='flex items-center gap-2 rounded bg-black/70 text-white cursor-pointer p-1'>
                                <Image src={data.product_image} width={100} height={100} alt='' className='w-[50px]' />
                                <div className='flex flex-col gap-1 cursor-pointer'>
                                    <Label>{data.product_name}</Label>
                                    <Label>{data.price}</Label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 items-center text-white">
                    <button className={`${isList && 'bg-white text-black'} text-[14px] rounded p-1`} onClick={setListDisplay}><CiBoxList /></button>
                    <button className={`${isList == false && 'bg-white text-black'} text-[14px] rounded p-1`} onClick={setGridDisplay}><IoGridOutline /></button>
                </div>
            </div>

        </div >

    )
}

export default CategoriesHeader
