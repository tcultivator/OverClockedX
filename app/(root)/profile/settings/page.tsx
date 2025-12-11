import React from 'react'
import { Label } from '@/components/ui/label'
import SettingsComponents from '@/components/Profile/SettingsComponents'
import db from '@/lib/db'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
type count = {
    subscriber: number
}
const Settings = async () => {
    const session = await auth();
    if (!session) {
        redirect('/')

    }
    const isNewsLetterSubscriber = await db.query('SELECT COUNT(*) AS subscriber FROM subscribe_users WHERE email = ?', [session.user?.email])
    const checkResult = isNewsLetterSubscriber[0] as count[]


    return (
        <div className='px-2 py-5 w-full flex flex-col gap-2'>
            <div className='w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%] mx-auto flex flex-col gap-2'>
                <div className=' '>
                    <Label className='text-[15px] md:text-[20px] font-orbitron font-normal'>Settings</Label>
                </div>
                <SettingsComponents
                    checkResult={checkResult}
                    email={session.user?.email} />
            </div>
        </div>

    )
}

export default Settings
