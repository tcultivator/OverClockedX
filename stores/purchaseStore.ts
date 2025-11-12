import { create } from 'zustand'
import { GroupedOrder } from '@/types/GroupOrder'
type purchaseType = {
    purchaseData: GroupedOrder[],
    setPurchaseData: (value: GroupedOrder[]) => void,
}
export const usePurchaseStore = create<purchaseType>((set) => ({
    purchaseData: [],
    setPurchaseData: (value: GroupedOrder[]) => {
        set({
            purchaseData: value
        })
    }
}))