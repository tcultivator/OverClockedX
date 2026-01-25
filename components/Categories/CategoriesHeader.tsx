import React, { useState } from 'react'
import { IoGridOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { useFilterStore } from '@/stores/filterStore';
import { useCategoriesHeaderStore } from '@/stores/categoriesHeaderStore';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CiSearch } from "react-icons/ci";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoFilterOutline } from "react-icons/io5";
import { useSearchParams } from 'next/navigation'
import { BsFillXCircleFill } from "react-icons/bs";
const CategoriesHeader = () => {
    const setFilterDisplay = useFilterStore((state) => state.setFilterDisplay)
    const router = useRouter();
    const setListDisplay = useCategoriesHeaderStore((state) => state.setListDisplay)
    const setGridDisplay = useCategoriesHeaderStore((state) => state.setGridDisplay)
    const isList = useCategoriesHeaderStore((state) => state.isList)
    const [searchValu, setSearchVal] = useState('')
    const searchParams = useSearchParams();

    const [searchActive, setSearchActive] = useState(false)

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSearchActive(true)
        const params = new URLSearchParams(searchParams.toString());
        const arr: string[] = []
        params.forEach((value, key) => {
            arr.push(key)
        })
        
        for (const item of arr) {
            params.delete(item)
            window.history.pushState({}, '', `?${params.toString()}`);
        }
        params.set('search', searchValu.toString());
        window.history.pushState({}, '', `?${params.toString()}`);
    }

    const clearSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('search');
        setSearchActive(false)
        setSearchVal('')
        window.history.pushState({}, '', `?${params.toString()}`);
    }

    useEffect(() => {
        const search = searchParams.get('search') || ''
        
        if (search == '') {
            clearSearch()
        }


    }, [searchParams])



    return (
        <div className="flex bg-white justify-between sticky gap-1 items-center top-0 z-30  p-2 md:px-5 w-full font-Abyssinica font-thin h-max border-b border-black/20 md:justify-end">
            <button className='block md:hidden bg-white text-black text-[14px] rounded p-1' onClick={() => setFilterDisplay(true)}><IoFilterOutline /></button>
            <div className='flex items-center gap-5'>
                <div className='relative'>
                    <form onSubmit={handleSearch} className='flex gap-2 items-center'>
                        {searchActive && <button className='flex items-center text-[13px] justify-center gap-2' onClick={clearSearch}><BsFillXCircleFill className='text-red-400' /> Clear Search</button>}
                        <Input className='md:w-[350px]' type='text' placeholder='Search here...' value={searchValu || ''} onChange={(e) => setSearchVal(e.target.value)} />
                        <Button type='submit' disabled={searchValu == ''} variant={'default'}><CiSearch /></Button>
                    </form>
                </div>

                <div className="flex gap-2 items-center text-black">
                    <button className={`${isList && 'bg-black text-white'} text-[14px] rounded p-1`} onClick={setListDisplay}><CiBoxList /></button>
                    <button className={`${isList == false && 'bg-black text-white'} text-[14px] rounded p-1`} onClick={setGridDisplay}><IoGridOutline /></button>
                </div>
            </div>

        </div >

    )
}

export default CategoriesHeader
