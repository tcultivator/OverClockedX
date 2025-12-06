import { create } from 'zustand'
import { ProductsType } from '@/types/ProductTypes';
type featureProductsType = {
    featuredProducts: ProductsType[],
    setFeaturedProducts: (data: ProductsType[]) => void,
}
export const useFeatureProductsStore = create<featureProductsType>((set) => ({
    featuredProducts: [],
    setFeaturedProducts: (data) => {
        set({
            featuredProducts: data
        })
    }
}))