import { json } from 'zod';
import { create } from 'zustand'
import { useUserStore } from './userStore';
import { voucherTypes } from '@/types/voucherTypes';

type voucher = {
    vouchers: voucherTypes[],
    getAllVouchers: () => void,
}

export const useVoucherStore = create<voucher>((set) => ({
    vouchers: [],
    getAllVouchers: async () => {
        try {
            const getVouchers = await fetch('/api/vouchers', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email: useUserStore.getState().user?.email })
            })
            const response = await getVouchers.json()
            
            set({
                vouchers: response
            })
        }
        catch (err) {
            console.log('error ')
        }
    }
}))