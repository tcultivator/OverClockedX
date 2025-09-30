// app/profile/layout.tsx
import React from 'react'
import { EdgeStoreProvider } from '@/lib/edgestore'
import ProfileNavBar from '@/components/ProfileNavBar/ProfileNavBar'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className=' text-white p-10 rounded  flex gap-10 w-[1200px] h-screen m-auto items-center'>
            <ProfileNavBar />
            <EdgeStoreProvider>
                {children}
            </EdgeStoreProvider>


        </div>
    )
}
