import React from 'react'
import { IoGridOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { useFilterStore } from '@/stores/filterStore';
import { useCategoriesHeaderStore } from '@/stores/categoriesHeaderStore';
const CategoriesHeader = () => {
    const setFilterDisplay = useFilterStore((state) => state.setFilterDisplay)

    const setListDisplay = useCategoriesHeaderStore((state) => state.setListDisplay)
    const setGridDisplay = useCategoriesHeaderStore((state) => state.setGridDisplay)
    const isList = useCategoriesHeaderStore((state) => state.isList)
    return (
        <div className="flex justify-between sticky top-0 z-0 p-2 px-5 w-full font-Abyssinica font-thin h-max border-b border-white/20 md:justify-end">
            <button className='block md:hidden' onClick={() => setFilterDisplay(true)}>Filter</button>
            <div className="flex gap-2 items-center text-white">
                <label htmlFor="">View as</label>
                <button className={`${isList && 'bg-white text-black'} text-[14px] rounded p-1`} onClick={setListDisplay}><CiBoxList /></button>
                <button className={`${isList==false && 'bg-white text-black'} text-[14px] rounded p-1`} onClick={setGridDisplay}><IoGridOutline /></button>
            </div>
        </div >

    )
}

export default CategoriesHeader
