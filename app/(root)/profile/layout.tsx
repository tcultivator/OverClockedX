// app/profile/layout.tsx
import React from 'react'
import { EdgeStoreProvider } from '@/lib/edgestore'
import ProfileNavBar from '@/components/ProfileNavBar/ProfileNavBar'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className=' text-white p-[2px] md:p-2 rounded flex flex-col box-border  h-screen items-center lg:flex-row md:gap-2 lg:w-[90%] lg:mx-auto xl:w-[70%] 2xl:w-[60%]'>
            <ProfileNavBar />
            <EdgeStoreProvider>
                {children}
            </EdgeStoreProvider>
        </div>
    )
}
