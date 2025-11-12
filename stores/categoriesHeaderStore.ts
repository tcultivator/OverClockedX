import { truncate } from 'node:fs/promises'
import { create } from 'zustand'

type categDisplayType = {
    productListDisplayOrientation: string[],
    setGridDisplay: () => void,
    setListDisplay: () => void,
    isList: boolean,
}
export const useCategoriesHeaderStore = create<categDisplayType>((set) => ({
    productListDisplayOrientation: ['w-full  grid grid-cols-2  rounded-[10px] relative p-2 z-0  gap-2 items-start sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ',
        ' h-full inset-shadow-sm inset-shadow-white/50 rounded-[10px] relative pb-[23px]',
        'flex flex-col h-full justify-between gap-1 cursor-pointer p-4 rounded',
        'flex flex-col gap-1 cursor-pointer',
        'w-full absolute bottom-0',
        'w-full flex items-center gap-2 justify-center font-normal bg-white text-black py-2 px-3 md:text-[12px] py-2 px-3 rounded-b-[10px]',
        'w-full aspect-square'],
    setGridDisplay: () => {
        set({
            productListDisplayOrientation: ['w-full  grid grid-cols-2  rounded-[10px] relative z-0   p-2  gap-2 items-start sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ',
                ' h-full inset-shadow-sm inset-shadow-white/50 rounded-[10px] relative pb-[23px]',
                'flex flex-col h-full justify-between gap-1 cursor-pointer p-4 rounded',
                'flex flex-col gap-1 cursor-pointer',
                'w-full absolute bottom-0',
                'w-full flex items-center gap-2 justify-center font-normal bg-white text-black py-2 px-3 md:text-[12px] py-2 px-3 rounded-b-[10px]',
                'w-full aspect-square'],
            isList: false
        })
    },
    setListDisplay: () => {
        set({
            productListDisplayOrientation: ['w-full  grid grid-cols-1 relative z-0  rounded-[10px]  p-2  gap-2 items-start',
                'bg-white/5 inset-shadow-sm inset-shadow-white/50 rounded-[10px] flex justify-between items-center',
                'flex flex-row justify-between cursor-pointer p-3 rounded items-center',
                'flex justify-between gap-1 cursor-pointer items-center',
                'w-full flex justify-end px-2',
                'w-max flex items-center text-[12px] gap-2 justify-center font-normal bg-white text-black md:py-2 md:px-3 md:text-[12px] py-2 px-3',
                'w-full h-full max-w-[150px] max-h-[150px] aspect-square bg-red'],
            isList: true
        })
    },
    isList: false,
}))