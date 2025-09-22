import React from 'react'
import { IoGridOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
const CategoriesHeader = () => {
    return (
        <div id="header" className="flex justify-between p-2 px-5 border-t border-b border-gray-400 w-[90%] m-auto">
            <div className='flex gap-5'>
                <div className="flex gap-2 items-center text-white ">
                    <label htmlFor="">Filter</label>
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </div>
                <label className="text-white">Sort by</label>
                <select name="" id="sort-by">
                    <option value="">Best Selling</option>
                    <option value="">Low to High</option>
                    <option value="">High to Low</option>
                    <option value="">opt4</option>
                    <option value="">opt5</option>
                </select>
            </div>

            <div className='flex gap-2 items-center text-white'>
                <label htmlFor="">View as</label>
                <button><CiBoxList /></button>
                <button><IoGridOutline /></button>
            </div>

        </div>
    )
}

export default CategoriesHeader
