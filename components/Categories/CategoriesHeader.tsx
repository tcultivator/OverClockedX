import React from 'react'
import { IoGridOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
const CategoriesHeader = () => {
    return (
        <div className="flex justify-end sticky top-0 z-0 p-2 px-5 w-full font-Abyssinica font-thin h-max border-b border-white/20">
            <div className="flex gap-2 items-center text-white">
                <label htmlFor="">View as</label>
                <button><CiBoxList /></button>
                <button><IoGridOutline /></button>
            </div>
        </div>

    )
}

export default CategoriesHeader
