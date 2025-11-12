import { create } from 'zustand'
import { GroupedOrder } from '@/types/GroupOrder'
import { useLoading } from './loadingStore'
import { toast } from "sonner"
type purchaseType = {
    purchaseData: GroupedOrder[],
    setPurchaseData: (value: GroupedOrder[]) => void,
    cancelOrder: (value: number) => void,
    selectedGroup: GroupedOrder | null,
    setSelectedGroup: (value: GroupedOrder) => void,
}
export const usePurchaseStore = create<purchaseType>((set) => ({
    purchaseData: [],
    setPurchaseData: (value: GroupedOrder[]) => {
        set({
            purchaseData: value
        })
    },
    cancelOrder: async (value: number) => {
        try {
            useLoading.getState().setButtonLoading(true)
            const cancelOrderRequest = await fetch('/api/cancelOrder', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ order_id: value })
            })
            const cancelOrderRequestResult = await cancelOrderRequest.json()
            if (cancelOrderRequestResult.status == 500) return

            const previousPurchaseData = usePurchaseStore.getState().purchaseData
            const finalPurchaseData = previousPurchaseData.map(data => {
                if (data.order_id == value) {
                    return {
                        ...data, order_status: 'cancel'
                    }
                }
                return data
            })
            const previouseSelectedGroup = usePurchaseStore.getState().selectedGroup
            const finalSelectedGroup = previouseSelectedGroup && { ...previouseSelectedGroup, order_status: 'cancel' }
            set({
                purchaseData: finalPurchaseData,
                selectedGroup: finalSelectedGroup

            })
            useLoading.getState().setButtonLoading(false)
            toast("Event has been created", {
                description: "Successfully cancel the order!",
            })

        } catch (err) {
            useLoading.getState().setButtonLoading(false)
        }

    },
    selectedGroup: null,
    setSelectedGroup: (value: GroupedOrder) => {
        set({
            selectedGroup: value
        })
    }
}))