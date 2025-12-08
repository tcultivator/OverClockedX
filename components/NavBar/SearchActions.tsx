"use client"
import React from 'react'
import { useSideBarStore } from '@/stores/sideBarStore';
import { CiSearch } from "react-icons/ci";
import { useRef } from 'react';
import { LiaTimesSolid } from "react-icons/lia";
import { useState } from 'react';
import { useFeatureProductsStore } from '@/stores/featuredProductsStore';
import { Label } from '../ui/label';
import Image from 'next/image';
import { ProductsType } from '@/types/ProductTypes';
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from 'next/navigation';
const SearchActions = () => {
    const router = useRouter();
    const setSideBar = useSideBarStore((state) => state.setSideBar)
    const sideBar = useSideBarStore((state) => state.sideBar)
    const inputRef = useRef<HTMLInputElement>(null);
    const [recentSearch, setRecentSearch] = useState(() => {
        try {
            const recentSearchData = localStorage.getItem('searchItems')
            const turnStringToArray = recentSearchData?.split(',')
            return turnStringToArray
        } catch (err) {
            return []
        }
    })



    const [openSearch, setOpenSearch] = useState(false)

    const openSearchWindow = () => {
        if (inputRef) {
            inputRef.current!.focus()
            setOpenSearch(true)
            setRecentSearch(() => {
                const recentSearchData = localStorage.getItem('searchItems')
                const turnStringToArray = recentSearchData?.split(',')
                if (turnStringToArray?.length) {
                    return turnStringToArray
                }
                else {
                    return []
                }
            })
        }
    }

    const closeSearchWindow = () => {
        setOpenSearch(false)
        setSearchResultData([])
        setAlreadySearch(false)
    }

    const featuredProducts = useFeatureProductsStore((state) => state.featuredProducts)

    const submitSearchInDashboard = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (inputRef.current?.value) {
            try {
                const recentSearchData = localStorage.getItem('searchItems')
                const turnStringToArray = recentSearchData?.split(',')
                if (turnStringToArray?.length) {
                    searchPostRequest(inputRef.current?.value)
                    turnStringToArray.push(inputRef.current?.value)
                    const turnArrayInotString = turnStringToArray.join(",")
                    localStorage.setItem('searchItems', turnArrayInotString)
                    inputRef.current.value = '';
                } else {
                    searchPostRequest(inputRef.current?.value)
                    localStorage.setItem('searchItems', inputRef.current?.value)
                    inputRef.current.value = '';
                }
            } catch (err) {
                searchPostRequest(inputRef.current?.value)
                localStorage.setItem('searchItems', inputRef.current?.value)
                inputRef.current.value = '';
            }




        }

    }
    const [searchResultData, setSearchResultData] = useState<ProductsType[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [alreadySearch, setAlreadySearch] = useState(false)

    const searchPostRequest = async (value: string) => {
        setSearchLoading(true)
        const submitSearchPostRequest = await fetch('/api/SearchInDashboard', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ searchValue: value })
        })
        const submitSearchPostRequestResult = await submitSearchPostRequest.json()
        if (submitSearchPostRequestResult.status == 500) {
            alert('something went wrong please try again')
            setSearchLoading(false)
            return
        }
        setSearchResultData(submitSearchPostRequestResult)
        setSearchLoading(false)
        setAlreadySearch(true)

    }


    return (
        <div className='w-[25%] flex items-center gap-4'>
            <div onClick={() => {
                setSideBar()
                console.log('eto ung sidebar')
            }} className={`flex flex-col gap-1 cursor-pointer w-[15px] ${sideBar ? 'px-0' : 'px-0'} md:hidden z-50 `}>
                <div className={`bg-black rounded w-[15px] h-[2px] transition duration-200 ${sideBar ? 'absolute rotate-45' : 'relative rotate-0'}`}></div>
                <div className={`bg-black rounded w-[15px] h-[2px] transition duration-200 ${sideBar ? 'absolute rotate-135' : 'relative rotate-0'}`}></div>
            </div>
            <div className={`${openSearch ? 'absolute top-0 left-0 h-[100vh] pt-2 md:h-max  w-full flex flex-col gap-2 items-start gap-2 text-black z-50' : 'flex items-center gap-2 text-black w-full  '}`}>

                <div className='w-full bg-white'>
                    <div className={`${openSearch ? 'w-full md:w-[85%] lg:w-[85%] xl:w-[75%] 2xl:w-[65%] mx-auto  items-center px-4' : 'w-full items-center'} bg-white h-max flex  gap-2`}>
                        <form onSubmit={submitSearchInDashboard} className={`${openSearch ? 'w-full' : 'w-max w-max-[200px]'}  px-1 flex items-center md:border  md:border-black/30 rounded`}>
                            <label
                                htmlFor="search"
                                onClick={openSearchWindow}
                                className="cursor-pointer"
                            >
                                <CiSearch className="aspect-square text-[22px]" />
                            </label>

                            <input
                                ref={inputRef}
                                onClick={openSearchWindow}
                                id="search"
                                name="search"
                                type="text"
                                placeholder="Search"
                                autoComplete="off"
                                className={`${openSearch ? ' outline-none border-0 py-[6px] text-[14px] w-full' : 'hidden md:flex outline-none border-0 py-[6px] text-[14px] w-full'}`}
                            />
                            <button className='hidden' type='submit'></button>
                        </form>

                        {openSearch && <LiaTimesSolid onClick={closeSearchWindow} className='aspect-square text-[22px] cursor-pointer' />}
                    </div>
                </div>

                <div className={`${openSearch ? 'w-full md:w-[85%] lg:w-[80%] xl:w-[70%] 2xl:w-[60%] mx-auto items-start px-4 rounded border border-black/30 flex' : 'w-full items-center hidden'} flex-col bg-[#F1F0EE] h-full  gap-5 py-5`}>
                    <div className='w-[100%] flex flex-col'>
                        {
                            !searchLoading && searchResultData.length != 0 ?

                                <div className="relative flex justify-start items-center">

                                    {/* LEFT BLUR */}
                                    <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10"></div>

                                    {/* RIGHT BLUR */}
                                    <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10"></div>

                                    {/* HORIZONTAL SCROLL WITHOUT SCROLLBAR */}
                                    <div className="overflow-x-auto no-scrollbar">
                                        <div className="flex gap-3">
                                            {searchResultData.map((data, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white p-1 rounded relative
                                                                   flex-shrink-0
                                                                   w-[45%] sm:w-[42%] md:w-[27%] lg:w-[19%] xl:w-[13%] min-w-[150px]"
                                                    onClick={() => {
                                                        closeSearchWindow()
                                                        router.push(`/product/${data.product_id}`)
                                                    }}
                                                >


                                                    <Image
                                                        src={data.product_image}
                                                        alt=""
                                                        width={500}
                                                        height={500}
                                                        className="aspect-square"
                                                    />

                                                    <div className="flex flex-col px-1 gap-1">
                                                        <Label className="text-[11px] text-black/50">{data.brand}</Label>
                                                        <Label className='line-clamp-3 text-[12px] text-center items-center'>{data.product_name}</Label>

                                                        <Label>
                                                            <span className=" text-black text-[12px] ml-2">
                                                                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
                                                                    .format(data.price)}
                                                            </span>
                                                        </Label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    {
                                        !searchLoading ?
                                            <Label>{alreadySearch ? 'No Results Found' : ''}</Label> :
                                            <Label className='flex items-center gap-2'> <Spinner /> Searching...</Label>
                                    }
                                </div>



                        }



                    </div>
                    <div className='w-full flex flex-col md:flex-row gap-5 h-full justify-between'>
                        <div className='flex flex-col gap-5 w-full md:w-[30%]'>
                            <div className='flex justify-start items-center py-3 border-b border-black/20'>
                                <Label className='font-orbitron uppercase '>Recent Search</Label>
                            </div>
                            <div className='flex flex-col gap-3 text-black/60 justify-start'>
                                {
                                    recentSearch && recentSearch.slice().reverse().slice(0, 8).map((data, index) => (
                                        <Label className='font-light' key={index}>{data}</Label>
                                    ))
                                }
                            </div>


                        </div>
                        <div className='w-full md:w-[70%] flex flex-col gap-5 '>
                            <div className='flex justify-start items-center py-3 border-b border-black/20'>
                                <Label className='font-orbitron uppercase'>You might like</Label>
                            </div>
                            <div className="relative flex justify-center items-center">

                                {/* LEFT BLUR */}
                                <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10"></div>

                                {/* RIGHT BLUR */}
                                <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10"></div>

                                {/* HORIZONTAL SCROLL WITHOUT SCROLLBAR */}
                                <div className="overflow-x-auto no-scrollbar">
                                    <div className="flex gap-2">
                                        {featuredProducts.map((data, index) => (
                                            <div
                                                key={index}
                                                className="bg-white p-1 rounded relative
                                                                   flex-shrink-0
                                                                   w-[35%] sm:w-[30%] md:w-[28%] lg:w-[22%] xl:w-[16%]"
                                                onClick={() => {
                                                    closeSearchWindow()
                                                    router.push(`/product/${data.product_id}`)
                                                }}
                                            >


                                                <Image
                                                    src={data.product_image}
                                                    alt=""
                                                    width={500}
                                                    height={500}
                                                    className="aspect-square"
                                                />

                                                <div className="flex flex-col px-1 gap-1">
                                                    <Label className="text-[11px] text-black/50">{data.brand}</Label>
                                                    <Label className='line-clamp-3 text-[12px] text-center items-center'>{data.product_name}</Label>

                                                    <Label>
                                                        <span className=" text-black text-[12px] ml-2">
                                                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
                                                                .format(data.price)}
                                                        </span>
                                                    </Label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>


            </div>
        </div>
    )

}

export default SearchActions
