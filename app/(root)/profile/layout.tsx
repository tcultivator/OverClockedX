// app/profile/layout.tsx
import React from 'react'
import { EdgeStoreProvider } from '@/lib/edgestore'
import ProfileNavBar from '@/components/ProfileNavBar/ProfileNavBar'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='  z-50 flex flex-col box-border bg-[#F1F0EE] absolute top-0 left-0 w-screen  h-screen items-center '>
            <ProfileNavBar />
            <EdgeStoreProvider>
                {children}
            </EdgeStoreProvider>
        </div>
    )
}
