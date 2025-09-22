// app/profile/layout.tsx
import React from 'react'
import ProfileNavBar from '@/components/ProfileNavBar/ProfileNavBar'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white p-10 rounded  flex gap-10 w-[1200px]   m-auto items-center'>
            <ProfileNavBar />
            {children}
        </div>
    )
}
