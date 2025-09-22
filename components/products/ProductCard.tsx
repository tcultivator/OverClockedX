import React from 'react'
import { ProductsType } from '@/types/ProductTypes'
import { Button } from '../ui/button'
type Props = {
    data: ProductsType
}
const ProductCard = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-3 cursor-pointer bg-white/20 p-4 rounded" >
            <img src={data.product_image} alt="" className="w-full h-full max-w-xs" />
            <label htmlFor="">{data.product_name}</label>
            <label className="text-2xl" htmlFor="">₱{data.price}</label>
            <div className="flex gap-2">
                <Button variant={'secondary'}>Buy</Button>
                <Button variant={'secondary'}>Add to Cart</Button>
            </div>

        </div>
    )
}

export default ProductCard
